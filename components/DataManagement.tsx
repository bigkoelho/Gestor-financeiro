import React, { useRef, useState } from 'react';
import { generateCSV, generateJSON, parseCSV, parseJSON } from '../utils/fileHelpers';
import { Transaction } from '../types';
import { Save, Upload, FileSpreadsheet, FileJson, RefreshCw } from 'lucide-react';

interface DataManagementProps {
  transactions: Transaction[];
  onImport: (newTransactions: Transaction[], replace: boolean) => void;
  onClear: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ transactions, onImport, onClear }) => {
  const [fileName, setFileName] = useState('gestor_financeiro');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let ext = '';

    if (format === 'json') {
      content = generateJSON(transactions);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      content = generateCSV(transactions);
      mimeType = 'text/csv;charset=utf-8;';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = (type: 'json' | 'csv') => {
    if (type === 'json' && fileInputRef.current) fileInputRef.current.click();
    if (type === 'csv' && csvInputRef.current) csvInputRef.current.click();
  };

  const processFile = (e: React.ChangeEvent<HTMLInputElement>, format: 'json' | 'csv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update filename based on import
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setFileName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsed: Transaction[] = [];
        
        if (format === 'json') {
          parsed = parseJSON(content);
        } else {
          parsed = parseCSV(content);
        }

        const shouldReplace = transactions.length > 0 
           ? window.confirm("Deseja SUBSTITUIR os dados atuais?\n(Cancelar = Adicionar aos existentes)")
           : true;

        onImport(parsed, shouldReplace);

      } catch (err) {
        alert("Erro ao importar ficheiro. Verifique o formato.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const handleNewFile = () => {
    if (transactions.length > 0) {
      if (!window.confirm("Tem a certeza? Isso apagará todos os dados não guardados da sessão atual.")) return;
    }
    onClear();
    setFileName('gestor_financeiro');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Save className="w-5 h-5 text-slate-600" />
        Gestão de Dados
      </h3>

      <div className="mb-4">
        <button 
          onClick={handleNewFile}
          className="w-full mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Novo Ficheiro (Limpar)
        </button>
        <hr className="border-slate-200 mb-4" />
        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Nome do Ficheiro</label>
        <input 
          type="text" 
          value={fileName} 
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:border-blue-500 outline-none" 
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={() => handleExport('json')} className="flex items-center justify-center gap-1 py-2 px-3 bg-slate-800 text-white rounded hover:bg-slate-900 text-sm font-medium">
          <FileJson className="w-4 h-4" /> Guardar JSON
        </button>
        <button onClick={() => handleImportClick('json')} className="flex items-center justify-center gap-1 py-2 px-3 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 text-sm font-medium">
          <Upload className="w-4 h-4" /> Ler JSON
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => handleExport('csv')} className="flex items-center justify-center gap-1 py-2 px-3 bg-green-700 text-white rounded hover:bg-green-800 text-sm font-medium">
          <FileSpreadsheet className="w-4 h-4" /> Exportar CSV
        </button>
        <button onClick={() => handleImportClick('csv')} className="flex items-center justify-center gap-1 py-2 px-3 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm font-medium">
          <Upload className="w-4 h-4" /> Ler CSV
        </button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => processFile(e, 'json')} />
      <input type="file" ref={csvInputRef} className="hidden" accept=".csv" onChange={(e) => processFile(e, 'csv')} />
    </div>
  );
};