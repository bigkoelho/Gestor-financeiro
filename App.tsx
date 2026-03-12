import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from './types';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { DataManagement } from './components/DataManagement';
import { EditModal } from './components/EditModal';
import { formatCurrency } from './utils/formatters';
import { ArrowLeft, PieChart } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Navigation State
  const [view, setView] = useState<'dashboard' | 'accumulated' | 'details'>('dashboard');
  const [activeType, setActiveType] = useState<TransactionType>('renda');
  
  // Edit State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Derived Data
  const rendas = transactions.filter(t => t.tipo === 'renda').sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  const despesas = transactions.filter(t => t.tipo === 'despesa').sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Accumulation Logic
  const getAccumulated = (type: TransactionType) => {
    const subset = type === 'renda' ? rendas : despesas;
    const groups = subset.reduce((acc, curr) => {
      acc[curr.descricao] = (acc[curr.descricao] || 0) + curr.valor;
      return acc;
    }, {} as Record<string, number>);
    
    return (Object.entries(groups) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .map(([desc, total]) => ({ desc, total }));
  };

  // Handlers
  const handleAdd = (t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...t, id: Date.now() }]);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem a certeza que deseja eliminar?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEdit = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleImport = (newTrans: Transaction[], replace: boolean) => {
    if (replace) {
      setTransactions(newTrans);
    } else {
      // Avoid duplicate IDs
      const safeNew = newTrans.map((t, i) => ({...t, id: Date.now() + i}));
      setTransactions(prev => [...prev, ...safeNew]);
    }
  };

  const handleClear = () => setTransactions([]);

  const navigateToDetails = (type: TransactionType) => {
    setActiveType(type);
    setView('details');
  };

  const navigateToAccumulated = (type: TransactionType) => {
    setActiveType(type);
    setView('accumulated');
  };

  // Views
  if (view === 'accumulated') {
    const data = getAccumulated(activeType);
    const color = activeType === 'renda' ? 'text-green-600' : 'text-red-600';
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Acumulados ({activeType})</h1>
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
             {data.length === 0 ? <p className="text-slate-500 text-center">Sem dados.</p> : (
               <ul className="space-y-4">
                 {data.map((item, idx) => (
                   <li key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                     <span className="font-medium text-slate-700">{item.desc}</span>
                     <span className={`font-bold ${color}`}>{formatCurrency(item.total)}</span>
                   </li>
                 ))}
               </ul>
             )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'details') {
    // Details view reuses transaction list but full width
    const list = activeType === 'renda' ? rendas : despesas;
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
           <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Detalhes ({activeType})</h1>
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
             <TransactionList 
                title={`Lista de ${activeType}s`}
                transactions={list}
                type={activeType}
                onDelete={handleDelete}
                onEdit={setEditingTransaction}
                showFilter={true}
             />
          </div>
        </div>
        <EditModal 
          isOpen={!!editingTransaction} 
          transaction={editingTransaction} 
          onClose={() => setEditingTransaction(null)}
          onSave={handleEdit}
        />
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
              <PieChart className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
              Gestor Financeiro
            </h1>
            <p className="text-slate-500 mt-2">Controle as suas finanças pessoais com facilidade.</p>
          </div>
        </header>

        <SummaryCards transactions={transactions} onViewDetails={navigateToAccumulated} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm 
              onAdd={handleAdd} 
              existingDescriptions={Array.from(new Set(transactions.map(t => t.descricao)))} 
            />
            <DataManagement 
              transactions={transactions} 
              onImport={handleImport} 
              onClear={handleClear}
            />
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-slate-700">Rendas Recentes</h3>
                 <button onClick={() => navigateToDetails('renda')} className="text-xs text-blue-600 font-medium hover:underline">Ver tudo</button>
               </div>
               <div className="flex-1 overflow-hidden">
                 <TransactionList 
                    title="" 
                    transactions={rendas} 
                    type="renda" 
                    onDelete={handleDelete} 
                    onEdit={setEditingTransaction} 
                 />
               </div>
            </div>

             <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-lg text-slate-700">Despesas Recentes</h3>
                 <button onClick={() => navigateToDetails('despesa')} className="text-xs text-blue-600 font-medium hover:underline">Ver tudo</button>
               </div>
               <div className="flex-1 overflow-hidden">
                 <TransactionList 
                    title="" 
                    transactions={despesas} 
                    type="despesa" 
                    onDelete={handleDelete} 
                    onEdit={setEditingTransaction} 
                 />
               </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal 
        isOpen={!!editingTransaction} 
        transaction={editingTransaction} 
        onClose={() => setEditingTransaction(null)}
        onSave={handleEdit}
      />
    </div>
  );
};

export default App;