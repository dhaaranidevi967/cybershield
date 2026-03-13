import React, { useState, useRef } from 'react';
import { Mic, Upload, Play, AlertTriangle, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { analyzeAudioTranscript } from '../services/aiService';

export default function AudioAnalyzer() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleAnalyze = async () => {
    if (!transcript) return;
    setLoading(true);
    try {
      const data = await analyzeAudioTranscript(transcript);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setTranscript("Hello, this is your bank calling. We have detected suspicious activity on your account. To prevent your account from being blocked, please share the OTP sent to your mobile immediately.");
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
          <Mic className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold">Audio Scam Analyzer</h1>
        <p className="text-gray-400">Upload a recording or paste a transcript to detect scam patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={simulateRecording}
          disabled={isRecording}
          className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${
            isRecording ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 'bg-white/5 border-white/10 hover:border-emerald-500/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isRecording ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <Mic className="w-6 h-6" />
          </div>
          <span className="font-bold">{isRecording ? 'Recording...' : 'Start Recording'}</span>
          <p className="text-xs text-gray-500">Record a live call for analysis</p>
        </button>

        <label className="p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-emerald-500/50 transition-all flex flex-col items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <span className="font-bold">Upload Audio</span>
          <p className="text-xs text-gray-500">MP3, WAV, or M4A files</p>
          <input type="file" className="hidden" accept="audio/*" />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Call Transcript
          </label>
          {transcript && (
            <button onClick={() => setTranscript('')} className="text-xs text-gray-500 hover:text-white">Clear</button>
          )}
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste call transcript here or record audio..."
          className="w-full h-40 p-6 bg-[#0f0f2d] border border-white/10 rounded-3xl focus:outline-none focus:border-emerald-500 transition-all resize-none"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !transcript}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Analyze Transcript
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-[#0f0f2d] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Analysis Result</h2>
              <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                result.probability > 70 ? 'bg-red-500/20 text-red-400' :
                result.probability > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {result.probability}% Scam Probability
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 italic">"{result.summary}"</p>
              
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-400">Suspicious Phrases Detected:</p>
                <div className="flex flex-wrap gap-2">
                  {result.suspiciousPhrases.map((phrase: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-400">Safety Recommendation</p>
              <p className="text-sm text-gray-300">If you hear these phrases, hang up immediately and contact your bank through their official app or website.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
