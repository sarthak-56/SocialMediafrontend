import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.data.token.access);
      setAuth(true);
      navigate('/main');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed: Incorrect email or password';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

 
  const nextStep = () => {
    if (step < 1) {  
      setStep(step + 1);
    }
  };

  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.description}>
        <h3 className={styles.appTitle}>Welcome back to Our SocialMedia!</h3>
       
      </div>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {step === 0 && ( 
          <>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username"
              required
              className={styles.input}
            />
            <div className={styles.buttonContainer}>
              <button type="button" onClick={nextStep} className={styles.button}>
                Next
              </button>
            </div>
          </>
        )}
        {step === 1 && ( 
          <>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={styles.input}
            />
            <div className={styles.buttonContainer}>
              <button type="button" onClick={prevStep} className={styles.button}>
                Back
              </button>
              <button type="submit" disabled={isLoading} className={styles.button}>
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </>
        )}
        {message && <div className={styles.alert}>{message}</div>}
        <div className={styles.navigation}>
          <p onClick={handleLoginRedirect} className={styles.link}>
            I don't have an account
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
