import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { calculateFinancialScore, detectAnomalies } from '../lib/mlEngine';
import { TrendingUp, BrainCircuit, DollarSign, PiggyBank, Loader2 } from 'lucide-react';
import { UploadCSV } from '../components/UploadCSV';
import { AddTransactionModal } from '../components/AddTransactionModal';

export function Dashboard() {
  const { transactions, userName, monthlyIncome, isProcessing } = useAppStore();
  
  const score = calculateFinancialScore(transactions, monthlyIncome);
  const scoreColor = score > 80 ? 'text-success' : score > 60 ? 'text-warning' : 'text-danger';
  
  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = Math.max(0, Math.round(((monthlyIncome - totalSpend) / monthlyIncome) * 100));
  
  const anomalies = detectAnomalies(transactions);
  const insight = anomalies.length > 0 ? anomalies[0] : null;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Welcome back, {userName}
          </h1>
          <p className="text-zinc-400 mt-1">Here is your real-time financial health snapshot.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <AddTransactionModal />
          <UploadCSV />
          <Button variant="primary" className="gap-2">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            Get Analysis
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <h2 className="text-zinc-400 font-medium mb-6">AI Financial Score</h2>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-zinc-800" />
              <motion.circle
                key={score} // re-animate when score changes
                initial={{ strokeDasharray: "0 1000" }}
                animate={{ strokeDasharray: `${score * 5.5} 1000` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96" cy="96" r="88" 
                stroke="currentColor" 
                strokeWidth="12" 
                strokeLinecap="round"
                fill="transparent" 
                className={scoreColor} 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-sm text-zinc-500 mt-1">/ 100</span>
            </div>
          </div>
          
          <Badge variant={score > 50 ? 'success' : 'warning'} className="mt-8 gap-1">
            <TrendingUp className="w-3 h-3" />
            {transactions.length ? 'Analyzed from recent statement' : 'Awaiting CSV Upload'}
          </Badge>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-primary/20 p-3 rounded-lg text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <Badge variant="default">This Month</Badge>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Total Spend</p>
              <h3 className="text-3xl font-bold mt-1">${totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm">
               <span className="text-zinc-500">Based on uploaded data</span>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="bg-success/20 p-3 rounded-lg text-success">
                <PiggyBank className="w-6 h-6" />
              </div>
              <Badge variant="default">Live Estimate</Badge>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Target Savings Rate</p>
              <h3 className="text-3xl font-bold mt-1">{savingsRate}%</h3>
            </div>
            <div className="flex items-center gap-2 text-sm">
               <span className="text-zinc-500">Income: ${monthlyIncome}/mo</span>
            </div>
          </Card>

          <Card className="sm:col-span-2 flex flex-col md:flex-row gap-6 relative overflow-hidden border-warning/30">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-warning to-danger" />
            <div className="flex-shrink-0">
              <div className="bg-warning/20 text-warning p-4 rounded-xl">
                <BrainCircuit className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {insight ? `Alert: ${insight.category}` : 'Waiting for Data'}
                {insight && <Badge variant="warning" className="text-[10px]">AI Insight</Badge>}
              </h3>
              <p className="text-zinc-300 mt-2 leading-relaxed">
                {insight ? insight.message : "Upload a CSV of your recent transactions to unlock personalized ML-driven insights."}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
