import React, { useState, useEffect } from 'react';
import { Zap, Activity, MapPin, Clock, ShieldAlert, Terminal, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function HoneypotTrap() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'honeypotLogs'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
            <Activity className="w-3 h-3" />
            Live Research Module
          </div>
          <h1 className="text-3xl font-bold">Honeypot Trap System</h1>
          <p className="text-gray-400">Monitoring attacker behavior through simulated phishing environments.</p>
        </div>
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Trap Status</p>
            <p className="text-lg font-bold text-orange-400">ACTIVE</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f2d] border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                Live Attack Logs
              </h2>
              <span className="text-xs text-gray-500">Real-time updates</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Behavior</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No recent activity detected.
                      </td>
                    </tr>
                  ) : logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-purple-400">{log.ip}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {log.location}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-white/5 text-xs">{log.behavior}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              How it works
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our honeypot simulates a vulnerable login page. When scammers attempt to harvest credentials, we log their technical footprint to improve our detection algorithms.
            </p>
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                IP Geolocation Tracking
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Browser Fingerprinting
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Interaction Pattern Analysis
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="font-bold mb-4">Research Goal</h3>
            <p className="text-sm text-gray-500 italic">
              "By understanding the attacker's methodology, we can build more resilient defense systems for the general public."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
