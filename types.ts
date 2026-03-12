export type TransactionType = 'renda' | 'despesa';

export interface Transaction {
  id: number;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD
  tipo: TransactionType;
}

export interface AppState {
  transactions: Transaction[];
}

export interface ImportResult {
  transactions: Transaction[];
  error?: string;
}