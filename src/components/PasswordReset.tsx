import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  TextField,
  Divider,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Launch as LaunchIcon,
  ContentCopy as ContentCopyIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config';

const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at?: string;
  token_type?: string;
  type?: string;
}

export const PasswordReset: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Parse URL parameters (both search and hash)
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Get tokens from either source
        const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
        const expiresAt = searchParams.get('expires_at') || hashParams.get('expires_at');
        const tokenType = searchParams.get('token_type') || hashParams.get('token_type');
        const type = searchParams.get('type') || hashParams.get('type');
        
        // Check for errors
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        
        console.log('Password reset URL params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          tokenType,
          type,
          error: errorParam,
          errorDescription
        });

        if (errorParam) {
          setError(`Password reset failed: ${errorDescription || errorParam}`);
          setLoading(false);
          return;
        }

        if (!accessToken || !refreshToken) {
          setError('Invalid reset link: Missing authentication tokens');
          setLoading(false);
          return;
        }

        if (type !== 'recovery') {
          setError('Invalid reset link: Wrong token type');
          setLoading(false);
          return;
        }

        // Store tokens for display
        const tokenData: TokenData = {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt || undefined,
          token_type: tokenType || undefined,
          type: type || undefined
        };
        setTokens(tokenData);

        // Verify the session with Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('Session verification error:', sessionError);
          setError(`Verification failed: ${sessionError.message || sessionError}`);
          
          // Still show success UI with tokens for manual use
          setTokens(tokenData);
          setSuccess(true);
        } else {
          console.log('✅ Password reset tokens verified successfully');
          setSuccess(true);
        }

      } catch (err) {
        console.error('Error processing password reset:', err);
        setError('An unexpected error occurred while processing the reset link.');
      } finally {
        setLoading(false);
      }
    };

    handlePasswordReset();
  }, []);

  const handleCopyTokens = async () => {
    if (!tokens) return;
    
    const tokenString = `Access Token: ${tokens.access_token}\nRefresh Token: ${tokens.refresh_token}`;
    
    try {
      await navigator.clipboard.writeText(tokenString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy tokens:', err);
    }
  };

  const handleOpenExtension = () => {
    const extensionId = 'dondapihdcdlpgkgfieobdeofbojhcjd';
    window.open(`chrome-extension://${extensionId}/sidebar.html`, '_blank');
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setPasswordUpdating(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(`Password update failed: ${updateError.message}`);
      } else {
        setPasswordUpdateSuccess(true);
        setShowPasswordForm(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #155e75 0%, #0891b2 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ocean Wave Texture */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 30px,
            rgba(255,255,255,0.08) 30px,
            rgba(255,255,255,0.08) 32px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 25px,
            rgba(255,255,255,0.06) 25px,
            rgba(255,255,255,0.06) 27px
          )`,
          animation: 'waveTexture 20s linear infinite'
        }} />

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '180px 180px 180px 180px / 290px 290px 100px 100px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 20%, #e2e8f0 50%, #cbd5e1 80%, #94a3b8 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #64748b',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
            position: 'relative',
            zIndex: 1,
            transform: 'perspective(800px) rotateX(5deg)',
            textAlign: 'center',
            maxWidth: 420
          }}
        >
          <CircularProgress sx={{ mb: 2, color: '#0284c7' }} />
          <Typography variant="h6" sx={{ color: '#334155', fontWeight: 600 }}>
            Processing password reset...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #155e75 0%, #0891b2 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ocean Wave Texture */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 30px,
          rgba(255,255,255,0.08) 30px,
          rgba(255,255,255,0.08) 32px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 25px,
          rgba(255,255,255,0.06) 25px,
          rgba(255,255,255,0.06) 27px
        )`,
        animation: 'waveTexture 20s linear infinite'
      }} />

      {/* Floating Ocean Bubbles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle 80px at 25% 20%, rgba(255,255,255,0.25) 0%, transparent 50%),
           radial-gradient(circle 60px at 75% 35%, rgba(255,255,255,0.2) 0%, transparent 50%),
           radial-gradient(circle 100px at 45% 70%, rgba(255,255,255,0.18) 0%, transparent 50%),
           radial-gradient(circle 70px at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
           radial-gradient(circle 90px at 15% 65%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
        animation: 'foamFloat 40s ease-in-out infinite'
      }} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: { xs: '95%', sm: 450, md: 500 },
          width: '100%',
          borderRadius: '180px 180px 180px 180px / 290px 290px 100px 100px',
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 20%, #e2e8f0 50%, #cbd5e1 80%, #94a3b8 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #64748b',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 1,
          transform: 'perspective(800px) rotateX(5deg)',
        }}
      >
        {/* Header with SurfMate Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}>
            <Box
              sx={{
                width: '70px',
                height: '70px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1) rotate(2deg)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              <LockIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>
          
          <Typography variant="h3" gutterBottom sx={{ 
            fontWeight: 900, 
            mb: 1.5,
            fontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.8rem' },
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            SurfMate
          </Typography>
          
          <Typography variant="h6" sx={{ 
            color: '#475569',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}>
            🔐 Password Reset
          </Typography>
        </Box>

        {/* Status Display */}
        {error ? (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              backgroundColor: alpha('#f87171', 0.1),
              border: '1px solid #f87171'
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {error}
            </Typography>
          </Alert>
        ) : success ? (
          <Alert 
            severity="success" 
            icon={<CheckCircleIcon />}
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              backgroundColor: alpha('#10b981', 0.1),
              border: '1px solid #10b981'
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {passwordUpdateSuccess 
                ? "🎉 Password updated successfully! You can now use your new password to sign in."
                : "✅ Password reset successful! Your authentication tokens have been verified."
              }
            </Typography>
          </Alert>
        ) : null}

        {/* Token Information */}
        {tokens && success && !passwordUpdateSuccess && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#334155' }}>
              Authentication Details:
            </Typography>
            <Stack spacing={1}>
              <Chip 
                label={`Token Type: ${tokens.token_type || 'bearer'}`}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: alpha('#0ea5e9', 0.1) }}
              />
              <Chip 
                label={`Type: ${tokens.type || 'recovery'}`}
                variant="outlined" 
                size="small"
                sx={{ backgroundColor: alpha('#0ea5e9', 0.1) }}
              />
              {tokens.expires_at && (
                <Chip 
                  label={`Expires: ${new Date(parseInt(tokens.expires_at) * 1000).toLocaleString()}`}
                  variant="outlined"
                  size="small"
                  sx={{ backgroundColor: alpha('#0ea5e9', 0.1) }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Password Update Form */}
        {success && !showPasswordForm && !passwordUpdateSuccess && (
          <>
            <Divider sx={{ my: 3, borderColor: '#cbd5e1' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#334155', fontWeight: 600 }}>
                🔑 Set New Password
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
                Complete your password reset by setting a new password
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowPasswordForm(true)}
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  px: 4,
                  py: 1.5
                }}
              >
                Set New Password
              </Button>
            </Box>
          </>
        )}

        {showPasswordForm && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#334155', fontWeight: 600 }}>
              Create New Password
            </Typography>
            <Stack spacing={3}>
              <TextField
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                fullWidth
                disabled={passwordUpdating}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha('#ffffff', 0.8)
                  }
                }}
              />
              <TextField
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                fullWidth
                disabled={passwordUpdating}
                slotProps={{
                  input: {
                    endAdornment: (
                      <Button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: alpha('#ffffff', 0.8)
                  }
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleUpdatePassword}
                  disabled={passwordUpdating || !newPassword || !confirmPassword}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    flex: 1
                  }}
                >
                  {passwordUpdating ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordForm(false)}
                  disabled={passwordUpdating}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    borderColor: '#64748b',
                    color: '#64748b'
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Action Buttons */}
        <Stack spacing={2} sx={{ mt: 4 }}>
          {(success || passwordUpdateSuccess) && (
            <Button
              variant="contained"
              size="large"
              startIcon={<LaunchIcon />}
              onClick={handleOpenExtension}
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                py: 1.5
              }}
            >
              Open SurfMate Extension
            </Button>
          )}

          {tokens && !passwordUpdateSuccess && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyTokens}
              disabled={copied}
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: '#64748b',
                color: '#64748b',
                py: 1.5
              }}
            >
              {copied ? '✅ Tokens Copied!' : 'Copy Tokens to Clipboard'}
            </Button>
          )}

          <Button
            variant="text"
            size="large"
            onClick={() => window.close()}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              color: '#64748b'
            }}
          >
            Close Window
          </Button>
        </Stack>

        {/* Instructions */}
        {(success || passwordUpdateSuccess) && (
          <Box sx={{ 
            mt: 4, 
            p: 3, 
            bgcolor: alpha('#0ea5e9', 0.1), 
            borderRadius: 3,
            border: '1px solid',
            borderColor: alpha('#0ea5e9', 0.2)
          }}>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#334155' }}>
              {passwordUpdateSuccess 
                ? "🏄‍♂️ All set! You can now return to the SurfMate extension and sign in with your new password."
                : "🌊 You can now return to the SurfMate extension. Your password reset has been processed successfully."
              }
            </Typography>
          </Box>
        )}
      </Paper>

      <style>
        {`
          @keyframes waveTexture {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(50px) translateY(-50px); }
          }
          @keyframes foamFloat {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.1) rotate(1deg); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};