import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../components/ui/card';
import FloatingEmojis from '../components/FloatingEmojis';
import AuthFields from '../components/AuthFields';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signup(username, password, instrument, false); // Always false for regular signup
      navigate('/main');
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 relative">
      <FloatingEmojis />
      <Card className="w-[400px] shadow-2xl relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            🎵 Join JaMoveo
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Create your account to start playing
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthFields
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              instrument={instrument}
              setInstrument={setInstrument}
              loading={loading}
              focusColor="blue"
              isAdmin={false}
            />
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Need admin access?{' '}
              <Link to="/admin-signup" className="text-purple-600 hover:underline font-medium">
                Admin Signup
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 