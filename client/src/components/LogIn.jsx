import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import InputField from './InputField';
import Button from './Button';
import useAuth from '../hook/useAuth';
import smallStar from '../assets/img/smallStar.svg';

const LogIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { authenticate, loading, error } = useAuth();
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (error && error.data) {
      setValidationErrors(error.data);
    } else if (error) {
      setValidationErrors([{ msg: error.message }]);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/users/login' : '/users/create';
    const data = isLogin ? { email, password } : { username: name, email, password };
    try {
      const result = await authenticate(url, data);
      if (isLogin) {
        navigate('/home'); 
      } else {
        setIsLogin(true); 
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-color-13 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-color-1 p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <img src={smallStar} alt="Star" className="absolute top-4 right-4" />
        <h2 className="text-3xl font-bold text-color-11 mb-6">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InputField
                  label="Username"
                  type="text"
                  placeholder="Your username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <InputField
            label="Email"
            type="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
          />
          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-color-10 font-bold text-sm hover:underline">
                Forgot your password?
              </a>
            </div>
          )}
          <Button type="submit">
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          {validationErrors.length > 0 && (
            <div className="mt-4">
              {validationErrors.map((err, index) => (
                <p key={index} className="text-red-500 text-sm">
                  {err.msg}
                </p>
              ))}
            </div>
          )}
        </form>
        <p className="mt-6 text-center text-color-2">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-color-10 font-bold hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LogIn;