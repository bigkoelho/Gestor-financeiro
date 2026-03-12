/**
 * Formata um número para a moeda (€ Euro).
 */
export const formatCurrency = (valor: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};

/**
 * Formata uma data YYYY-MM-DD para DD/MM/YYYY.
 */
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Retorna a data atual em YYYY-MM-DD.
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};