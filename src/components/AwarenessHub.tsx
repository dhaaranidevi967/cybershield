import React from 'react';
import { BookOpen, Shield, AlertTriangle, Phone, Globe, Lock, ChevronRight } from 'lucide-react';

export default function AwarenessHub() {
  const scams = [
    {
      title: "OTP Fraud",
      icon: Lock,
      desc: "Scammers call pretending to be bank officials and ask for your One-Time Password to 'verify' your account.",
      tips: ["Never share OTP with anyone", "Banks will never ask for OTP over call", "Check the SMS sender ID"]
    },
    {
      title: "Fake Job Scams",
      icon: BookOpen,
      desc: "Offers of high-paying remote jobs that require an upfront 'registration fee' or 'security deposit'.",
      tips: ["Legitimate jobs don't ask for money", "Verify company details on LinkedIn", "Be wary of 'too good to be true' offers"]
    },
    {
      title: "Phishing Emails",
      icon: Globe,
      desc: "Emails that look like they're from trusted brands (Amazon, Netflix) asking you to update payment info.",
      tips: ["Check the sender's email address", "Hover over links to see the real URL", "Look for spelling/grammar errors"]
    },
    {
      title: "Banking Scams",
      icon: Shield,
      desc: "Messages claiming your account is blocked and providing a link to 'reactivate' it.",
      tips: ["Only use official bank apps", "Don't click links in SMS", "Call your branch if in doubt"]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">Cyber Awareness Hub</h1>
        <p className="text-gray-400">Knowledge is your best defense. Learn about common scams and how to stay safe online.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {scams.map((scam, i) => (
          <div key={i} className="p-8 bg-[#0f0f2d] border border-white/5 rounded-3xl hover:border-purple-500/30 transition-all">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                <scam.icon className="w-7 h-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{scam.title}</h3>
                <p className="text-gray-400 leading-relaxed">{scam.desc}</p>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-purple-400">Safety Guidelines:</p>
                  {scam.tips.map((tip, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-500">
                      <ChevronRight className="w-4 h-4 text-purple-500" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <h2 className="text-3xl font-bold">Emergency Help</h2>
        </div>
        <p className="text-gray-300 text-lg max-w-3xl">
          If you have been a victim of a cyber scam, don't panic. Take immediate action to minimize the damage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Cybercrime Helpline</p>
              <p className="text-2xl font-bold">1930</p>
            </div>
          </div>
          <a 
            href="https://www.cybercrime.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-6 bg-black/20 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-black/40 transition-all"
          >
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Reporting Portal</p>
              <p className="text-xl font-bold">cybercrime.gov.in</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
