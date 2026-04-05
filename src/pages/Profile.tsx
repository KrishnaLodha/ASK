import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import { User } from 'lucide-react';
import React from 'react';

export function Profile() {
  const userName = useAppStore(state => state.userName);
  const monthlyIncome = useAppStore(state => state.monthlyIncome);
  const setUser = useAppStore(state => state.setUser);
  
  const [nameInput, setNameInput] = React.useState(userName);
  const [incomeInput, setIncomeInput] = React.useState(monthlyIncome.toString());

  const handleSave = () => {
    setUser(nameInput, parseFloat(incomeInput) || 0);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          User Profile
        </h1>
        <p className="text-zinc-400 mt-1">Manage your details and AI configurations.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-white">Personal Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
              <input 
                type="text" 
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Estimated Monthly Income ($)</label>
              <input 
                type="number" 
                value={incomeInput}
                onChange={e => setIncomeInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <Button className="w-full mt-4" onClick={handleSave}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
