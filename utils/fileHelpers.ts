import { Transaction } from '../types';
import { formatDateDisplay } from './formatters';

export const generateJSON = (transactions: Transaction[]) => {
  // Separate into the structure the user expects for compatibility
  const exportData = {
    rendas: transactions.filter(t => t.tipo === 'renda'),
    despesas: transactions.filter(t => t.tipo === 'despesa'),
  };
  return JSON.stringify(exportData, null, 2);
};

export const generateCSV = (transactions: Transaction[]) => {
  // Sort by date
  const sorted = [...transactions].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  
  const headers = ['Tipo', 'Descricao', 'Valor', 'Data'];
  let csvContent = headers.join(';') + '\r\n';

  sorted.forEach(t => {
    const tipo = t.tipo === 'renda' ? 'Renda' : 'Despesa';
    const descricao = `"${t.descricao.replace(/"/g, '""')}"`;
    // Format value to PT format (1.234,56)
    const valor = t.valor.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\./g, '').replace(',', ','); 
    // Note: The original code removed dots and swapped commas. standard toLocaleString with pt-PT does 1.234,56. 
    // To match CSV Excel expectations in EU, we usually want 1234,56 or 1234.56. 
    // Let's stick to a safe standard: 1234,56 (no thousands separator, comma decimal) for CSV compatibility in PT.
    const valorFormatted = t.valor.toFixed(2).replace('.', ',');
    const data = formatDateDisplay(t.data);
    
    csvContent += [tipo, descricao, valorFormatted, data].join(';') + '\r\n';
  });

  return "\uFEFF" + csvContent; // BOM for Excel
};

export const parseJSON = (jsonString: string): Transaction[] => {
  try {
    const data = JSON.parse(jsonString);
    if (!data || (!data.rendas && !data.despesas)) {
      throw new Error("Formato inválido");
    }

    const rendas = (data.rendas || []).map((t: any) => ({ ...t, tipo: 'renda' as const, id: t.id || Date.now() + Math.random() }));
    const despesas = (data.despesas || []).map((t: any) => ({ ...t, tipo: 'despesa' as const, id: t.id || Date.now() + Math.random() }));
    
    return [...rendas, ...despesas];
  } catch (e) {
    throw new Error("Erro ao ler JSON");
  }
};

export const parseCSV = (csvContent: string): Transaction[] => {
  const lines = csvContent.split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0];
  const delimiter = header.includes(';') ? ';' : ',';
  const regexSplit = new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`);

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const parts = line.split(regexSplit);
    if (parts.length < 4) continue;

    const rawTipo = parts[0].trim().toLowerCase();
    const descricao = parts[1].trim().replace(/^"|"$/g, '').replace(/""/g, '"');
    let valorStr = parts[2].trim().replace(/"/g, '');
    let dataStr = parts[3].trim();

    // Value Parsing Logic (Ported)
    const ultimoPonto = valorStr.lastIndexOf('.');
    const ultimaVirgula = valorStr.lastIndexOf(',');

    if (ultimaVirgula > ultimoPonto) {
      valorStr = valorStr.replace(/\./g, '').replace(',', '.');
    } else if (ultimoPonto > ultimaVirgula) {
      valorStr = valorStr.replace(/,/g, '');
    } else if (ultimaVirgula > -1) {
      valorStr = valorStr.replace(',', '.');
    }

    const valor = parseFloat(valorStr);

    // Date Parsing
    if (dataStr.includes('/')) {
        const dateParts = dataStr.split('/');
        if (dateParts.length === 3) {
            const part1 = parseInt(dateParts[0]);
            const part2 = parseInt(dateParts[1]);
            let dia, mes;
            
            if (part1 > 12) { // dd/mm/yyyy
                dia = dateParts[0].padStart(2, '0');
                mes = dateParts[1].padStart(2, '0');
            } else if (part2 > 12) { // mm/dd/yyyy
                dia = dateParts[1].padStart(2, '0');
                mes = dateParts[0].padStart(2, '0');
            } else {
                dia = dateParts[0].padStart(2, '0');
                mes = dateParts[1].padStart(2, '0');
            }
            let ano = dateParts[2];
             if (ano.length === 2) ano = '20' + ano;
            dataStr = `${ano}-${mes}-${dia}`;
        }
    }

    if (isNaN(valor) || !['renda', 'despesa'].includes(rawTipo)) continue;

    transactions.push({
      id: Date.now() + i,
      descricao,
      valor,
      data: dataStr,
      tipo: rawTipo as 'renda' | 'despesa'
    });
  }

  return transactions;
};