import React from 'react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  transactions: Transaction[];
  onViewDetails: (tipo: 'renda' | 'despesa') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, onViewDetails }) => {
  const rendas = transactions.filter(t => t.tipo === 'renda').reduce((acc, t) => acc + t.valor, 0);
  const despesas = transactions.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
  const saldo = rendas - despesas;

  const saldoColor = saldo > 0 ? 'text-green-600' : saldo < 0 ? 'text-red-600' : 'text-blue-600';

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Rendas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Rendas Totais</h2>
          <ArrowUpCircle className="text-green-500 w-6 h-6" />
        </div>
        <p className="text-3xl font-bold text-slate-800">{formatCurrency(rendas)}</p>
        <button 
          onClick={() => onViewDetails('renda')}
          className="mt-4 text-sm text-green-700 bg-green-50 hover:bg-green-100 font-medium py-2 px-4 rounded-lg w-full transition-colors border border-green-100"
        >
          Ver Acumulados
        </button>
      </div>

      {/* Despesas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Despesas Totais</h2>
          <ArrowDownCircle className="text-red-500 w-6 h-6" />
        </div>
        <p className="text-3xl font-bold text-slate-800">{formatCurrency(despesas)}</p>
        <button 
          onClick={() => onViewDetails('despesa')}
          className="mt-4 text-sm text-red-700 bg-red-50 hover:bg-red-100 font-medium py-2 px-4 rounded-lg w-full transition-colors border border-red-100"
        >
          Ver Acumulados
        </button>
      </div>

      {/* Saldo */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="w-24 h-24 text-blue-800" />
        </div>
        <div className="flex items-center justify-between mb-2 relative z-10">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Saldo Atual</h2>
        </div>
        <p className={`text-3xl font-bold relative z-10 ${saldoColor}`}>{formatCurrency(saldo)}</p>
        <div className="mt-4 h-10 w-full"></div> {/* Spacer to match height */}
      </div>
    </section>
  );
};