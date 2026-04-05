import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { categorizeTransaction } from '../lib/mlEngine';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';

export function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const addTransactions = useAppStore(s => s.addTransactions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    addTransactions([{
      id: Math.random().toString(36).substring(2, 9),
      date,
      description,
      amount: parseFloat(amount),
      category: categorizeTransaction(description)
    }]);
    
    setDescription('');
    setAmount('');
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Manual</span>
      </Button>
      
      {isOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add Transaction</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
             <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <input type="text" placeholder="e.g. Starbucks Coffee" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Amount ($)</label>
                <input type="number" step="0.01" min="0" placeholder="5.50" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors" required />
              </div>
              
              <Button type="submit" variant="primary" className="w-full mt-6">Save & Analyze</Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
