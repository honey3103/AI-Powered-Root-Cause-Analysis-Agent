import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[#f4f5f7] text-[#172b4d]">
      <div className="w-full max-w-md p-8 rounded-lg border border-[#dfe1e6] bg-white shadow-sm space-y-6">
        
        {/* Atlassian Jira Branding */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#0052cc] fill-current">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.34 4.35V2h-10.47zm-4.7 4.78c0 2.4 1.97 4.35 4.35 4.35h1.78v1.75c0 2.4 1.97 4.35 4.35 4.35V6.78H6.83zm-4.7 4.79c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H2.13z"/>
            </svg>
            <span className="text-2xl font-bold tracking-tight text-[#172b4d]">
              Jira <span className="font-normal text-[#5e6c84]">Software</span>
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#172b4d] pt-1">
            Create your project account
          </h2>
          <p className="text-xs text-[#5e6c84]">
            Register to create incidents and perform 5-Whys investigations.
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] placeholder-[#6b778c] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@company.com"
              className="w-full px-3 py-2 rounded border border-[#dfe1e6] bg-[#fafbfc] text-[#172b4d] placeholder-[#6b778c] focus:outline-none focus:border-[#4c9aff] focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172b4d] mb-1">
              Password (Min 6 characters)
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
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-[#ebecf0] text-center space-y-1 text-xs">
          <p className="text-[#5e6c84]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0052cc] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
