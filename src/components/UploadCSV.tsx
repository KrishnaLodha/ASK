import React, { useRef } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';
import { categorizeTransaction } from '../lib/mlEngine';
import type { Transaction } from '../types';

export function UploadCSV({ className }: { className?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addTransactions = useAppStore(state => state.addTransactions);
  const setProcessing = useAppStore(state => state.setProcessing);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: Transaction[] = results.data.map((row: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          date: row.Date || row.date || new Date().toISOString().split('T')[0],
          description: row.Description || row.description || 'Unknown',
          amount: parseFloat(row.Amount || row.amount || '0'),
          category: categorizeTransaction(row.Description || row.description || ''),
        })).filter(t => !isNaN(t.amount));
        
        // Simulate ML processing time
        setTimeout(() => {
          addTransactions(parsed);
          setProcessing(false);
        }, 1500);
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={className}>
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />
      <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
        <UploadCloud className="w-4 h-4" />
        Upload CSV
      </Button>
    </div>
  );
}
