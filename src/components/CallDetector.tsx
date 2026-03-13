import React, { useState, useEffect } from 'react';
import { Phone, Search, AlertTriangle, ShieldCheck, ShieldAlert, Flag, Loader2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CallDetector() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [scamType, setScamType] = useState('Bank Scam');
  const [description, setDescription] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'scamNumbers'), where('number', '==', number));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setResult(querySnapshot.docs[0].data());
      } else {
        setResult({ status: 'unknown' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!number) return;
    if (!auth.currentUser) {
      alert('Please login to submit a report.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        target: number,
        type: 'phone',
        scamType,
        description,
        reporterUid: auth.currentUser.uid,
        timestamp: new Date().toISOString()
      });
      
      // Also update/create scamNumbers entry (simplified for demo)
      await addDoc(collection(db, 'scamNumbers'), {
        number,
        riskScore: 85,
        reportCount: 1,
        scamType,
        lastReported: new Date().toISOString()
      });

      alert('Report submitted successfully!');
      setShowReportForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-3xl flex items-center justify-center mx-auto">
          <Phone className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold">Scam Call Detector</h1>
        <p className="text-gray-400">Check if a phone number has been reported for fraudulent activity.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="+1 234 567 890"
          className="w-full px-6 py-5 bg-[#0f0f2d] border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500 transition-all pr-32"
        />
        <button
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Search
        </button>
      </form>

      {result && (
        <div className={`p-8 rounded-3xl border ${
          result.status === 'unknown' ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/20'
        }`}>
          {result.status === 'unknown' ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold">No Reports Found</h2>
                <p className="text-gray-400 mt-1">This number hasn't been flagged in our database yet.</p>
              </div>
              <button 
                onClick={() => setShowReportForm(true)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:underline"
              >
                <Flag className="w-4 h-4" />
                Report this number as a scam
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-6">
              <div className="p-4 bg-red-500/20 text-red-400 rounded-2xl">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h2 className="text-2xl font-bold text-red-400">High Risk Caller</h2>
                  <p className="text-gray-300">This number has been reported {result.reportCount} times.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Scam Type</p>
                    <p className="font-medium">{result.scamType}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Risk Score</p>
                    <p className="font-medium text-red-400">{result.riskScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showReportForm && (
        <div className="p-8 bg-[#0f0f2d] border border-purple-500/30 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flag className="text-purple-400" />
            Report Scam Number
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Scam Type</label>
              <select 
                value={scamType}
                onChange={(e) => setScamType(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none"
              >
                <option>Bank Scam</option>
                <option>OTP Scam</option>
                <option>Loan Scam</option>
                <option>Lottery Scam</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Details (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none h-24"
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleReport}
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                Submit Report
              </button>
              <button 
                onClick={() => setShowReportForm(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
