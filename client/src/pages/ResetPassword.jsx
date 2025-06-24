import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6).split('');
    paste.forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el?.value || '');
    const enteredOtp = otpArray.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    setOtpValue(enteredOtp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (!email || !otpValue || !newPassword) {
      toast.error('Email, OTP, and new password are required');
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: otpValue,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <Box className="min-h-screen flex justify-center items-center bg-[#F9F9F9] px-4">
      {!isEmailSent && (
        <Paper elevation={6} sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#1e293b',
        }}>
          <Typography variant="h5" fontWeight={600} mb={2}>Reset Password</Typography>
          <Typography variant="body2" mb={3}>
            Enter your registered email address.
          </Typography>
          <form onSubmit={onSubmitEmail}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                background: 'linear-gradient(to right, #4ade80, #15803d)',
                textTransform: 'none'
              }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <Paper elevation={6} sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#1e293b',
        }}>
          <Typography variant="h5" fontWeight={600} mb={2}>Reset OTP</Typography>
          <Typography variant="body2" mb={3}>
            Enter the 6-digit code sent to your email.
          </Typography>
          <form onSubmit={onSubmitOTP}>
            <Box onPaste={handlePaste} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    required
                    style={{
                      width: '40px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '20px',
                      border: '1px solid #ccc',
                      borderRadius: '6px'
                    }}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </Box>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                background: 'linear-gradient(to right, #4ade80, #15803d)',
                textTransform: 'none'
              }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      )}

      {isEmailSent && isOtpSubmitted && (
        <Paper elevation={6} sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#1e293b',
        }}>
          <Typography variant="h5" fontWeight={600} mb={2}>New Password</Typography>
          <Typography variant="body2" mb={3}>
            Enter your new password below.
          </Typography>
          <form onSubmit={onSubmitNewPassword}>
            <TextField
              fullWidth
              required
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                background: 'linear-gradient(to right, #4ade80, #15803d)',
                textTransform: 'none'
              }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default ResetPassword;
