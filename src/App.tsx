/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Phone, 
  Mic, 
  BookOpen, 
  MessageSquare, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

// Pages
import Home from './components/Home';
import WebsiteChecker from './components/WebsiteChecker';
import CallDetector from './components/CallDetector';
import AudioAnalyzer from './components/AudioAnalyzer';
import AwarenessHub from './components/AwarenessHub';
import SupportBot from './components/SupportBot';
import HoneypotTrap from './components/HoneypotTrap';

type Page = 'home' | 'website' | 'call' | 'audio' | 'awareness' | 'support' | 'honeypot';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'website', label: 'Website Checker', icon: Globe },
    { id: 'call', label: 'Scam Call Detector', icon: Phone },
    { id: 'audio', label: 'Audio Scam Analyzer', icon: Mic },
    { id: 'awareness', label: 'Awareness Hub', icon: BookOpen },
    { id: 'support', label: 'Victim Support Bot', icon: MessageSquare },
    { id: 'honeypot', label: 'Honeypot Trap', icon: Zap },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'website': return <WebsiteChecker />;
      case 'call': return <CallDetector />;
      case 'audio': return <AudioAnalyzer />;
      case 'awareness': return <AwarenessHub />;
      case 'support': return <SupportBot />;
      case 'honeypot': return <HoneypotTrap />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-sans selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <Shield className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Cyber Safety Shield
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as Page)}
                  className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                    currentPage === item.id ? 'text-purple-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                >
                  Logout
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-medium transition-all"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400 hover:text-white">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0f0f2d] border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
                      currentPage === item.id ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-white/10">
                  {user ? (
                    <button 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-gray-400 hover:bg-white/5 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Logout
                    </button>
                  ) : (
                    <button 
                      onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-purple-400 bg-purple-500/20 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Login with Google
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 AI Cyber Safety Shield. Protecting you from digital threats.</p>
        <p className="mt-2">Emergency Cyberline: <span className="text-purple-400 font-bold">1930</span></p>
      </footer>
    </div>
  );
}

