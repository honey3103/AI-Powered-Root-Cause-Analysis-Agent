import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[#09090b] text-zinc-100">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white font-bold mb-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Create Account
          </h2>
          <p className="text-xs text-zinc-400">
            Register to save and analyze server incident investigations.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-300 mb-1.5">
              Password (Min 6 characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800 text-center space-y-1 text-xs">
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
