import React from 'react';
import { Transaction } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { Trash2, Edit2, ListFilter } from 'lucide-react';

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
  type: 'renda' | 'despesa';
  onDelete: (id: number) => void;
  onEdit: (t: Transaction) => void;
  showFilter?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  title, 
  transactions, 
  type, 
  onDelete, 
  onEdit,
  showFilter = false 
}) => {
  const colorClass = type === 'renda' ? 'text-green-600' : 'text-red-600';
  const bgColorClass = type === 'renda' ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className={`flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${colorClass} flex items-center gap-2`}>
           {showFilter && <ListFilter className="w-5 h-5" />}
           {title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-3 custom-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            Nenhuma {type} registada.
          </div>
        ) : (
          transactions.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all flex justify-between items-center group">
              <div className="min-w-0 flex-1 pr-4">
                <span className="block font-semibold text-slate-800 truncate">{t.descricao}</span>
                <span className="block text-xs text-slate-500">{formatDateDisplay(t.data)}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`font-bold ${colorClass}`}>
                  {type === 'renda' ? '+' : '-'} {formatCurrency(t.valor)}
                </span>
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => onEdit(t)} 
                     className="p-1.5 text-blue-600 hover:bg-blue-50 rounded bg-white border border-blue-200 shadow-sm"
                     title="Editar"
                   >
                     <Edit2 className="w-3 h-3" />
                   </button>
                   <button 
                     onClick={() => onDelete(t.id)} 
                     className="p-1.5 text-red-600 hover:bg-red-50 rounded bg-white border border-red-200 shadow-sm"
                     title="Eliminar"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};