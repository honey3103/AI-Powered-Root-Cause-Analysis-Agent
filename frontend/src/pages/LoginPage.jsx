import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[#f4f5f7] text-[#172b4d]">
      <div className="w-full max-w-md p-8 rounded-lg border border-[#dfe1e6] bg-white shadow-sm space-y-6">

        {/* Atlassian Jira Branding */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0052cc] fill-current">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.34 4.35V2h-10.47zm-4.7 4.78c0 2.4 1.97 4.35 4.35 4.35h1.78v1.75c0 2.4 1.97 4.35 4.35 4.35V6.78H6.83zm-4.7 4.79c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H2.13z" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-[#172b4d]">
              RCA <span className="font-normal text-[#5e6c84]">Agent</span>
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#172b4d] pt-1">
            Sign in to your account
          </h2>
          <p className="text-xs text-[#5e6c84]">
            AI-Powered Root Cause Analysis &amp; Incident Investigation System
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-[#ffebe6] border border-[#ffbdad] text-[#de350b] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="harsh@test.com"
              className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] placeholder-[#6b778c] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] placeholder-[#6b778c] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-[#0052cc] hover:bg-[#0065ff] font-medium text-xs text-white transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fill button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-1.5 rounded border border-[#dfe1e6] bg-[#ebecf0] hover:bg-[#dfe1e6] text-[#172b4d] text-xs font-medium transition"
          >
            Fill Demo Credentials (harsh@test.com)
          </button>
        </div>

        <div className="pt-3 border-t border-[#ebecf0] text-center space-y-1 text-xs">
          <p className="text-[#5e6c84]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0052cc] font-medium hover:underline">
              Sign up for an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
