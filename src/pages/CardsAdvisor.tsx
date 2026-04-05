import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { getCardRecommendations } from '../lib/mlEngine';
import { CreditCard, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

export function CardsAdvisor() {
  const transactions = useAppStore(state => state.transactions);
  const recommendation = getCardRecommendations(transactions);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Card Advisor
          </h1>
          <p className="text-zinc-400 mt-1">AI-driven recommendations to maximize your rewards.</p>
        </div>
      </header>

      {transactions.length === 0 ? (
         <Card className="text-center py-20">
           <h3 className="text-xl font-bold text-zinc-300 mb-2">Upload Data for Card Recommendations</h3>
           <p className="text-zinc-500">ML engine needs spending patterns to recommend your optimal card setup.</p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Card Setup */}
        <Card className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Baseline Setup</h3>
              <p className="text-zinc-400 text-sm">Generic Rewards Card (1%)</p>
            </div>
            <Badge variant="default" className="text-zinc-300">Active</Badge>
          </div>
          
          <div className="relative h-48 w-full max-w-[320px] mx-auto bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-xl p-6 text-white shadow-2xl flex flex-col justify-between mb-6 border border-white/10">
            <div className="flex justify-between items-start w-full">
              <span className="font-bold text-xl tracking-wider">BANK</span>
              <CreditCard className="w-8 h-8 opacity-80" />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono tracking-widest opacity-80">•••• •••• •••• 1234</span>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Recommendation Engine */}
        <Card className="flex flex-col relative overflow-hidden border-primary/20">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
              <p className="text-zinc-400 text-sm">Based on your highest spend category</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-white text-lg">{recommendation.cardName}</h4>
                <p className="text-success text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {recommendation.reason}
                </p>
              </div>
              <Badge variant="success" className="bg-success/10 text-success">Top Match</Badge>
            </div>

            <div className="space-y-3 mb-6">
              {recommendation.features.map((f: string) => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
               <div>
                <p className="text-zinc-400 text-sm">Est. Net Annual Value</p>
                <p className="text-2xl font-bold text-success">+${recommendation.netValue}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm text-right">Added Savings</p>
                <p className="text-primary font-medium text-right">+${recommendation.savings} vs current</p>
              </div>
            </div>
          </div>
        </Card>
      </div>)}
    </div>
  );
}
