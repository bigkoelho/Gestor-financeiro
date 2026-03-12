import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface EditModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (t: Transaction) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, transaction, onClose, onSave }) => {
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (transaction) {
      setDesc(transaction.descricao);
      setVal(transaction.valor.toString());
      setDate(transaction.data);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...transaction,
      descricao: desc,
      valor: parseFloat(val),
      data: date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Editar Transação</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <input 
              type="text" 
              value={desc} 
              onChange={e => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={val} 
                  onChange={e => setVal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                  required 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 outline-none"
                  required 
                />
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded shadow-md transition-colors">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};