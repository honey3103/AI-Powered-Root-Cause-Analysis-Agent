import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LogIn, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('harsh@test.com');
    setPassword('password123');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[#050507] text-zinc-100 font-mono">
      {/* Coroot Grid & Glow */}
      <div className="absolute inset-0 coroot-grid pointer-events-none opacity-30"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 coroot-glow pointer-events-none"></div>

      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl border border-[#1f1f28] bg-[#0c0c11] shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-400 text-black font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.35)] mb-2">
            CR
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white font-mono">
              coroot<span className="text-emerald-400">/auth</span>
            </h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              v0.8.2
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans">
            Sign in to access incident telemetry and autonomous root cause analysis.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="font-sans">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="harsh@test.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#23232c] bg-[#07070a] text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-bold text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Authenticating Gateway...</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign In to Console</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-300 text-[11px] font-mono transition flex items-center justify-center gap-1.5"
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Load Demo Account (harsh@test.com)</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#1f1f28] text-center space-y-2">
          <p className="text-xs text-zinc-400 font-sans">
            Need an account?{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline font-mono">
              Register now
            </Link>
          </p>
          <div className="text-[10px] text-zinc-500 font-mono">
            Investigator attribution: Harsh (CSE)
          </div>
        </div>
      </div>
    </div>
  );
};
