import React, { useState } from 'react';
import { Globe, ShieldCheck, ShieldAlert, ShieldX, Search, Loader2 } from 'lucide-react';
import { analyzeWebsite } from '../services/aiService';

export default function WebsiteChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const data = await analyzeWebsite(url);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold">Phishing Shield</h1>
        <p className="text-gray-400">Enter a website link to check if it's safe to open.</p>
      </div>

      <form onSubmit={handleCheck} className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-6 py-5 bg-[#0f0f2d] border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500 transition-all pr-32"
        />
        <button
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Check
        </button>
      </form>

      {result && (
        <div className={`p-8 rounded-3xl border ${
          result.color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20' :
          result.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl ${
              result.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
              result.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {result.color === 'green' ? <ShieldCheck className="w-8 h-8" /> :
               result.color === 'yellow' ? <ShieldAlert className="w-8 h-8" /> :
               <ShieldX className="w-8 h-8" />}
            </div>
            <div className="space-y-2">
              <h2 className={`text-2xl font-bold ${
                result.color === 'green' ? 'text-emerald-400' :
                result.color === 'yellow' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {result.riskLevel} Website
              </h2>
              <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Domain Age', desc: 'Checks how long the site has existed' },
          { label: 'SSL Status', desc: 'Verifies secure connection certificates' },
          { label: 'Blacklist', desc: 'Cross-references known scam databases' }
        ].map((item, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <h4 className="font-bold text-sm mb-1">{item.label}</h4>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
