import { useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function Auth() {
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome to Infinity Game</h2>
      {error && <div className="error-message">{error}</div>}
      <button 
        className="google-sign-in-btn"
        onClick={handleGoogleSignIn}
      >
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="google-icon"
        />
        Sign in with Google
      </button>
    </div>
  );
}

export default Auth; 