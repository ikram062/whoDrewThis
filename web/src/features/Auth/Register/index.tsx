import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
// later add zod validation

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async () => {
    await register({ username, email, password });
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/Le_train_à_Jeufosse_(1884)_Claude_Monet.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-pink-200/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-pink-100/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-pink-300/60">
          <h2 className="text-3xl font-bold text-center mb-2 text-pink-600">Create Account</h2>
          <p className="text-center text-pink-500 mb-6">Join us today</p>

          {error && error !== 'Email already used' && error !== 'Username already used' && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              Registration failed
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-pink-600 mb-2">
                Username
              </label>
              {error === 'Username already used' && (
                <p className="mt-1 text-sm text-red-500">Username already used</p>
              )}
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-pink-50/90 border border-pink-200 rounded-lg text-pink-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pink-600 mb-2">
                Email
              </label>
              {error === 'Email already used' && (
                <p className="mt-1 text-sm text-red-500">Email already used</p>
              )}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-pink-50/90 border border-pink-200 rounded-lg text-pink-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-pink-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-pink-50/90 border border-pink-200 rounded-lg text-pink-700 placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-pink-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-500 hover:text-pink-600 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;