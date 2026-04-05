import type { Transaction } from '../types';

// Simple Keyword Classifier acting as our ML categorization model
const categoryKeywords: Record<string, string[]> = {
  'Food & Dining': ['restaurant', 'cafe', 'starbucks', 'uber eats', 'doordash', 'mcdonalds', 'dinner', 'lunch', 'pizza', 'grocery', 'whole foods', 'trader joe'],
  'Transport': ['uber', 'lyft', 'gas', 'shell', 'chevron', 'transit', 'subway', 'airline', 'flight', 'parking'],
  'Shopping': ['amazon', 'target', 'walmart', 'clothes', 'nike', 'apple', 'best buy'],
  'Utilities': ['electric', 'water', 'gas', 'internet', 'comcast', 'verizon', 'att', 't-mobile', 'bill'],
  'Entertainment': ['netflix', 'spotify', 'hulu', 'disney+', 'amc', 'ticketmaster', 'game'],
  'Housing': ['rent', 'mortgage'],
};

// Simple ML simulation: Text Classification for Categories
export const categorizeTransaction = (description: string): string => {
  const normalized = description.toLowerCase();
  
  // Basic Naive string matching acting as our bag-of-words
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
};

// ML Simulation: Anomaly Detection
export const detectAnomalies = (transactions: Transaction[]) => {
  if (!transactions.length) return [];
  
  const categoryTotals: Record<string, number> = {};
  transactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const anomalies = [];
  // Dummy logic: if any single category takes up more than 30% of total non-housing spend, or >$500 abruptly
  for (const [cat, amount] of Object.entries(categoryTotals)) {
    if (cat === 'Entertainment' && amount > 150) {
      anomalies.push({
        category: cat,
        amount,
        type: 'spike',
        message: `Your ${cat} spending jumped significantly this month. Identified recurring charges: Spotify, Netflix.`,
      });
    } else if (cat === 'Food & Dining' && amount > 800) {
       anomalies.push({
        category: cat,
        amount,
        type: 'spike',
        message: `You ran 15% over budget on ${cat} this month.`,
      });
    }
  }

  return anomalies;
};

// AI Financial Score Calculator
export const calculateFinancialScore = (transactions: Transaction[], monthlyIncome: number = 5000): number => {
  if (!transactions.length) return 50; // default baseline

  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = Math.max(0, ((monthlyIncome - totalSpend) / monthlyIncome) * 100);
  
  let score = 50; // Starting base
  
  // Weights simulating an ML model prediction feature importance
  // 1. Savings Ratio (40% weight) -> optimal is >20%
  if (savingsRate >= 20) score += 20;
  else if (savingsRate > 0) score += savingsRate;

  // 2. Spending Diversity (penalty for >50% income on single non-housing category)
  const categoryTotals: Record<string, number> = {};
  transactions.forEach(t => categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount);
  const highestSpend = Math.max(...Object.values(categoryTotals));
  if (highestSpend > (monthlyIncome * 0.4)) score -= 15;

  // 3. Absolute spend factor
  if (totalSpend < monthlyIncome * 0.8) score += 15;

  return Math.min(100, Math.max(0, Math.round(score)));
};

// Card Recommendation Engine
export const getCardRecommendations = (transactions: Transaction[]) => {
  const categoryTotals: Record<string, number> = {};
  transactions.forEach(t => categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount);
  
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, 'Other');

  // Hardcoded rules mapping to 'model predictions'
  if (topCategory === 'Food & Dining') {
    return {
      cardName: "Amex Gold Card",
      reason: "Maximized for your Food & Dining",
      features: ["4x points at Restaurants (your #1 category)", "4x points at US Supermarkets", "$250 Annual Fee"],
      netValue: 504,
      savings: 315
    };
  } else if (topCategory === 'Transport') {
    return {
      cardName: "Chase Sapphire Reserve",
      reason: "Maximized for your Transit & Travel",
      features: ["3x points on Travel globally", "10x on Lyft", "$550 Annual Fee"],
      netValue: 450,
      savings: 210
    };
  }
  
  // Default fallback
  return {
    cardName: "Citi Double Cash",
    reason: "Consistent rewards for diverse spend",
    features: ["2% cash back on everything", "No annual fee", "Good for non-category spend"],
    netValue: 300,
    savings: 150
  };
};
