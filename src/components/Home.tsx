import React from 'react';
import { Shield, Globe, Phone, Mic, BookOpen, MessageSquare, Zap, ChevronRight, AlertCircle } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: any) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const tools = [
    { id: 'website', label: 'Website Checker', icon: Globe, desc: 'Analyze links for phishing threats', color: 'bg-blue-500/20 text-blue-400' },
    { id: 'call', label: 'Call Detector', icon: Phone, desc: 'Check numbers for scam reports', color: 'bg-purple-500/20 text-purple-400' },
    { id: 'audio', label: 'Audio Analyzer', icon: Mic, desc: 'Detect scams in call recordings', color: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'support', label: 'Victim Support', icon: MessageSquare, desc: 'AI help for scam victims', color: 'bg-pink-500/20 text-pink-400' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Powered by Advanced AI
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Your Digital <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Guardian</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Protect yourself from online scams, phishing websites, and fraudulent calls with our AI-powered safety shield.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('website')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20"
          >
            Start Protecting Now
          </button>
          <button 
            onClick={() => onNavigate('awareness')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all"
          >
            Learn About Scams
          </button>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className="group p-6 bg-[#0f0f2d] border border-white/5 rounded-3xl text-left hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tool.color}`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{tool.label}</h3>
            <p className="text-gray-500 text-sm">{tool.desc}</p>
          </button>
        ))}
      </section>

      {/* Stats & Tips */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-gradient-to-br from-[#1a1a3a] to-[#0f0f2d] rounded-3xl border border-white/5">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="text-orange-400" />
            Live Threat Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-white/5">
              <p className="text-gray-500 text-sm mb-1">Phishing Sites Detected</p>
              <p className="text-3xl font-bold text-blue-400">12,482</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5">
              <p className="text-gray-500 text-sm mb-1">Scam Numbers Blocked</p>
              <p className="text-3xl font-bold text-purple-400">8,921</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5">
              <p className="text-gray-500 text-sm mb-1">Users Protected</p>
              <p className="text-3xl font-bold text-emerald-400">45,000+</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#0f0f2d] rounded-3xl border border-white/5 space-y-4">
          <h2 className="text-xl font-bold mb-4">Quick Safety Tips</h2>
          <div className="space-y-4">
            {[
              "Never share your OTP with anyone.",
              "Verify unknown links before clicking.",
              "Banks never ask for passwords via call.",
              "Report suspicious activity to 1930."
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-400">
                <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
