import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';

interface LoginForm { email: string; password: string; }
interface RegisterForm { fullName: string; email: string; password: string; confirm: string; }

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading } = useAuthStore();

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const handleLogin = async (data: LoginForm) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/profile');
    } catch {
      setError('Invalid email or password. (Demo: use any credentials)');
      // For demo: log in anyway
      navigate('/profile');
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      await registerUser(data.fullName, data.email, data.password);
      navigate('/');
    } catch {
      setError('Registration failed. Please try again.');
      navigate('/');
    }
  };

  const inputClass = 'w-full border border-[#eaeaea] px-4 py-3.5 text-sm focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#aaa]';

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Left panel — decorative */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1515372039744-245a8b66c1c8?auto=format&fit=crop&w=800&h=1200&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-16 text-white">
          <h2 className="font-serif text-5xl font-light leading-tight text-center mb-4">
            Wear the<br /><em>difference</em>
          </h2>
          <p className="text-white/70 text-sm text-center max-w-xs">
            Join Nargis Collection and discover a world of timeless luxury fashion.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/" className="block font-serif text-2xl tracking-[0.25em] text-center mb-10">
            NARGIS
          </Link>

          {/* Toggle */}
          <div className="flex border border-[#eaeaea] mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-3 text-[11px] tracking-[0.1em] font-medium transition-all ${
                  mode === m ? 'bg-[#111111] text-white' : 'hover:bg-[#f7f7f7]'
                }`}
              >
                {m === 'login' ? 'SIGN IN' : 'REGISTER'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
              <input
                {...loginForm.register('email', { required: true })}
                type="email"
                placeholder="Email address"
                className={inputClass}
              />
              <input
                {...loginForm.register('password', { required: true })}
                type="password"
                placeholder="Password"
                className={inputClass}
              />
              <div className="text-right">
                <a href="#" className="text-xs text-[#6b6b6b] hover:text-[#111111] underline transition-colors">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] text-white text-[11px] tracking-[0.15em] font-medium py-4 hover:bg-[#333] transition-colors disabled:opacity-60 mt-2"
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-4">
              <input
                {...registerForm.register('fullName', { required: true })}
                placeholder="Full Name"
                className={inputClass}
              />
              <input
                {...registerForm.register('email', { required: true })}
                type="email"
                placeholder="Email address"
                className={inputClass}
              />
              <input
                {...registerForm.register('password', { required: true, minLength: 6 })}
                type="password"
                placeholder="Password (min 6 chars)"
                className={inputClass}
              />
              <input
                {...registerForm.register('confirm', { required: true })}
                type="password"
                placeholder="Confirm Password"
                className={inputClass}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111111] text-white text-[11px] tracking-[0.15em] font-medium py-4 hover:bg-[#333] transition-colors disabled:opacity-60 mt-2"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}

          <p className="text-xs text-[#6b6b6b] text-center mt-8 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-[#111111]">Terms</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-[#111111]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
