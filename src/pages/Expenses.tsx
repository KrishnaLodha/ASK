import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { detectAnomalies } from '../lib/mlEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export function Expenses() {
  const transactions = useAppStore(s => s.transactions);
  const anomalies = detectAnomalies(transactions);

  const categoryMap: Record<string, number> = {};
  transactions.forEach(t => categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount);
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#6b7280'];
  const expenseData = Object.entries(categoryMap).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length]
  })).sort((a,b) => b.value - a.value);

  const total = expenseData.reduce((s, d) => s + d.value, 0);

  // Group transactions by Date to show a trend line
  const dateMap: Record<string, number> = {};
  transactions.forEach(t => {
    dateMap[t.date] = (dateMap[t.date] || 0) + t.amount;
  });
  
  const trendData = Object.entries(dateMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, spend]) => ({ date, spend }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-300 font-medium mb-1">{label || payload[0].name}</p>
          <p className="text-white font-bold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Expense Intelligence</h1>
          <p className="text-zinc-400 mt-1">AI-powered categorization and trend analysis.</p>
        </div>
        <Badge variant="primary" className="text-sm px-4 py-2">
          {transactions.length} Transactions
        </Badge>
      </header>

      {transactions.length === 0 ? (
        <Card className="text-center py-20">
           <h3 className="text-xl font-bold text-zinc-300 mb-2">No Data Available</h3>
           <p className="text-zinc-500">Go to the Dashboard to upload your bank statement CSV.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-4">Breakdown</h3>
            <div className="flex-1 w-full min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-zinc-400 text-sm">Total</span>
                <span className="text-xl font-bold text-white">${total.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 h-20 overflow-y-auto">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-zinc-300">
                  <span className="w-3 h-3 min-w-3 min-h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2 flex flex-col h-[400px]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-white">Daily Spending Trend</h3>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {anomalies.map((anomaly, idx) => (
              <Card key={idx} className={`flex flex-col border ${anomaly.type === 'spike' ? 'border-danger/20' : 'border-primary/20'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${anomaly.type === 'spike' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Anomaly Detected: {anomaly.category}</h3>
                </div>
                <p className="text-zinc-300 mb-4">{anomaly.message}</p>
                <div className="mt-auto">
                    <Button variant="outline" className="w-full text-zinc-300">Review Transactions</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
