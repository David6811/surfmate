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
  Container,
  TextField,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Launch as LaunchIcon,
  ContentCopy as ContentCopyIcon
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
    // Try to open the extension
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
        setError('');
        setShowPasswordForm(false);
        setNewPassword('');
        setConfirmPassword('');
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.innerHTML = '✅ Password updated successfully!';
        successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4caf50; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999;';
        document.body.appendChild(successAlert);
        setTimeout(() => document.body.removeChild(successAlert), 3000);
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Processing password reset...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          width: '100%',
          maxWidth: 500
        }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              SurfMate
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Password Reset
            </Typography>
          </Box>

          {/* Status Display */}
          {error ? (
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {error}
              </Typography>
            </Alert>
          ) : success ? (
            <>
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon />}
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Password reset successful! Your authentication tokens have been verified.
                </Typography>
              </Alert>

              {/* Token Information */}
              {tokens && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Authentication Details:
                  </Typography>
                  <Stack spacing={1}>
                    <Chip 
                      label={`Token Type: ${tokens.token_type || 'bearer'}`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip 
                      label={`Type: ${tokens.type || 'recovery'}`}
                      variant="outlined" 
                      size="small"
                    />
                    {tokens.expires_at && (
                      <Chip 
                        label={`Expires: ${new Date(parseInt(tokens.expires_at) * 1000).toLocaleString()}`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>
                </Box>
              )}
            </>
          ) : null}

          {/* Password Update Form */}
          {success && !showPasswordForm && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Set New Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Complete your password reset by setting a new password
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowPasswordForm(true)}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Set New Password
                </Button>
              </Box>
            </>
          )}

          {showPasswordForm && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create New Password
              </Typography>
              <Stack spacing={2}>
                <TextField
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  disabled={passwordUpdating}
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  disabled={passwordUpdating}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleUpdatePassword}
                    disabled={passwordUpdating || !newPassword || !confirmPassword}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    {passwordUpdating ? <CircularProgress size={20} /> : 'Update Password'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={passwordUpdating}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Action Buttons */}
          <Stack spacing={2} sx={{ mt: 4 }}>
            {success && (
              <Button
                variant="contained"
                size="large"
                startIcon={<LaunchIcon />}
                onClick={handleOpenExtension}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Open SurfMate Extension
              </Button>
            )}

            {tokens && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyTokens}
                disabled={copied}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {copied ? 'Tokens Copied!' : 'Copy Tokens to Clipboard'}
              </Button>
            )}

            <Button
              variant="text"
              size="large"
              onClick={() => window.close()}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Close Window
            </Button>
          </Stack>

          {/* Instructions */}
          {success && (
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                You can now return to the SurfMate extension. 
                Your password reset has been processed successfully.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};