'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function AdminProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state for fetching profile
  const [profileLoading, setProfileLoading] = useState(false); // Loading state for profile form submission
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false); // Loading state for password form submission
  const [profileFetchError, setProfileFetchError] = useState<string | null>(null); // State to store profile fetch error

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/profile');
        const data = await response.json();
        if (!response.ok) {
          setProfileFetchError(data.error || 'Gagal memuat data profil.');
          toast.error(data.error || 'Gagal memuat data profil.');
        } else if (data.profile) {
          setUsername(data.profile.name);
          setEmail(data.profile.email);
        }
      } catch (error) {
        setProfileFetchError('Gagal memuat data profil.');
        toast.error('Gagal memuat data profil.');
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const calculatePasswordStrength = useCallback((password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++; // Base for length
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++; // Mixed case
    if (password.match(/\d/)) strength++; // Numbers
    if (password.match(/[^a-zA-Z0-9]/)) strength++; // Symbols

    if (strength === 0) return '';
    if (strength < 2) return 'Lemah';
    if (strength < 4) return 'Sedang';
    return 'Kuat';
  }, []);

  const validateNewPassword = useCallback((password: string) => {
    if (password.length < 8) {
      setNewPasswordError('Minimal 8 karakter');
      return false;
    }
    setNewPasswordError('');
    return true;
  }, []);

  const validateConfirmNewPassword = useCallback((newPass: string, confirmPass: string) => {
    if (newPass !== confirmPass) {
      setConfirmNewPasswordError('Password tidak sama');
      return false;
    }
    setConfirmNewPasswordError('');
    return true;
  }, []);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordStrength(calculatePasswordStrength(newPass));
    validateNewPassword(newPass);
    validateConfirmNewPassword(newPass, confirmNewPassword); // Re-validate confirm field
  };

  const handleConfirmNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPass = e.target.value;
    setConfirmNewPassword(confirmPass);
    validateConfirmNewPassword(newPassword, confirmPass);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    const toastId = toast.loading('Menyimpan profil...');

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { id: toastId });
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan profil.', { id: toastId });
      console.error('Error updating profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmNewPassword(newPassword, confirmNewPassword);

    if (!isNewPasswordValid || !isConfirmPasswordValid || !oldPassword || !newPassword || !confirmNewPassword) {
      toast.error('Harap lengkapi semua kolom password dengan benar.');
      return;
    }

    setPasswordChangeLoading(true);
    const toastId = toast.loading('Mengubah password...');

    try {
      const response = await fetch('/api/admin/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { id: toastId });
        // Clear password fields after successful update
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordStrength('');
        setNewPasswordError('');
        setConfirmNewPasswordError('');
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah password.', { id: toastId });
      console.error('Error changing password:', error);
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const isPasswordFormValid =
    oldPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmNewPassword.length > 0 &&
    !newPasswordError &&
    !confirmNewPasswordError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Memuat profil...</p>
      </div>
    );
  }

  if (profileFetchError) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <p className="text-red-500 text-lg mb-4">Error: {profileFetchError}</p>
        <p className="text-gray-600">Pastikan Anda login dan memiliki akses.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-20 pb-8 p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Profil Admin</CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {/* Informasi Akun Section - Display Only */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Informasi Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Field */}
              <div>
                <Label htmlFor="username" className="text-base font-medium mb-2 flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  className="h-12 text-base rounded-lg"
                  value={username}
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">Nama pengguna yang akan ditampilkan.</p>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-base font-medium mb-2 flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-gray-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="h-12 text-base rounded-lg"
                  value={email}
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">Alamat email untuk notifikasi dan reset password.</p>
              </div>
            </div>
          </div>

          {/* Keamanan Akun Section */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-8 pt-8 border-t">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Keamanan Akun</h2>
            {/* Old Password Field */}
            <div>
              <Label htmlFor="old-password" className="text-base font-medium mb-2 flex items-center">
                <Lock className="mr-2 h-5 w-5 text-gray-500" />
                Password Lama
              </Label>
              <div className="relative">
                <Input
                  id="old-password"
                  name="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Masukkan password lama Anda"
                  className="h-12 text-base rounded-lg pr-10"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleOldPasswordVisibility}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Verifikasi password Anda saat ini.</p>
            </div>

            {/* New Password Field */}
            <div>
              <Label htmlFor="new-password" className="text-base font-medium mb-2 flex items-center">
                <Lock className="mr-2 h-5 w-5 text-gray-500" />
                Password Baru
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Masukkan password baru"
                  className="h-12 text-base rounded-lg pr-10"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
              {newPasswordError && (
                <p className="text-sm text-red-500 mt-1">{newPasswordError}</p>
              )}
              {passwordStrength && (
                <p
                  className={cn(
                    'text-sm mt-1 font-medium',
                    passwordStrength === 'Lemah' && 'text-red-500',
                    passwordStrength === 'Sedang' && 'text-yellow-500',
                    passwordStrength === 'Kuat' && 'text-green-500'
                  )}
                >
                  Kekuatan Password: {passwordStrength}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">Minimal 8 karakter, kombinasi huruf, angka, dan simbol.</p>
            </div>

            {/* Confirm New Password Field */}
            <div>
              <Label htmlFor="confirm-new-password" className="text-base font-medium mb-2 flex items-center">
                <Lock className="mr-2 h-5 w-5 text-gray-500" />
                Konfirmasi Password Baru
              </Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password baru"
                  className="h-12 text-base rounded-lg pr-10"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleConfirmNewPasswordVisibility}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
              {confirmNewPasswordError && (
                <p className="text-sm text-red-500 mt-1">{confirmNewPasswordError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Masukkan kembali password baru Anda untuk konfirmasi.</p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg rounded-lg bg-primary hover:bg-primary/90"
              disabled={!isPasswordFormValid || passwordChangeLoading}
            >
              {passwordChangeLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}