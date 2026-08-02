import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, User, Lock } from 'lucide-react';

export default function LoginScreen({ onBack, onSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen" style={{ display: 'flex' }}>
      <div className="mesh-bg" />
      <div className="auth-card">
        <button className="btn-back" onClick={onBack}>
          <ChevronLeft size={16} /> Back to Home
        </button>
        <div className="auth-header">
          <h1>Workspace Login</h1>
          <p>Access your IT wholesale dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" required />
            </div>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="input-container">
              <Lock size={18} className="input-icon" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}
