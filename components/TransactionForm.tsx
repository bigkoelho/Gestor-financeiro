import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { getTodayDate } from '../utils/formatters';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  existingDescriptions: string[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, existingDescriptions }) => {
  const [tipo, setTipo] = useState<TransactionType>('renda');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(getTodayDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (!descricao || isNaN(valNum) || valNum <= 0 || !data) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    onAdd({
      descricao,
      valor: valNum,
      data,
      tipo
    });

    setDescricao('');
    setValor('');
    setData(getTodayDate());
    // Keep the type selected
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-blue-600" />
        Nova Transação
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className={`cursor-pointer text-center py-3 px-4 rounded-lg border transition-all ${tipo === 'renda' ? 'bg-green-600 text-white border-green-600 font-semibold shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
          <input type="radio" name="tipo" className="hidden" checked={tipo === 'renda'} onChange={() => setTipo('renda')} />
          Renda (+)
        </label>
        <label className={`cursor-pointer text-center py-3 px-4 rounded-lg border transition-all ${tipo === 'despesa' ? 'bg-red-600 text-white border-red-600 font-semibold shadow-md' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}>
          <input type="radio" name="tipo" className="hidden" checked={tipo === 'despesa'} onChange={() => setTipo('despesa')} />
          Despesa (-)
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <input 
            type="text" 
            list="desc-list"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            placeholder="Ex: Salário, Supermercado..."
          />
          <datalist id="desc-list">
            {existingDescriptions.map((desc, i) => <option key={i} value={desc} />)}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor (€)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
            <input 
              type="date" 
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
        Adicionar
      </button>
    </form>
  );
};