'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateProfile, getProfile } from './actions';
import { toast } from 'react-hot-toast';

export default function AdminProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state for fetching profile
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await getProfile();
        setUsername(profile.username);
        setEmail(profile.email);
      } catch (error) {
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

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    if (strength === 0) return '';
    if (strength < 2) return 'Lemah';
    if (strength < 4) return 'Sedang';
    return 'Kuat';
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan perubahan...');

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const response = await updateProfile(formData);

      if (response.success) {
        toast.success(response.message, { id: toastId });
        // Re-fetch profile data to ensure UI is updated with latest info
        const updatedProfile = await getProfile();
        setUsername(updatedProfile.username);
        setEmail(updatedProfile.email);
        // Clear password fields after successful update
        (e.currentTarget as HTMLFormElement).reset();
        setPasswordStrength('');
      } else {
        toast.error(response.message, { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan perubahan.', { id: toastId });
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-2 text-lg">Memuat profil...</p>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informasi Akun Section */}
            <div className="space-y-6">
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
                    placeholder="Masukkan username Anda"
                    className="h-12 text-base rounded-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="Masukkan email Anda"
                    className="h-12 text-base rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">Alamat email untuk notifikasi dan reset password.</p>
                </div>
              </div>
            </div>

            {/* Keamanan Akun Section */}
            <div className="space-y-6">
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
                    onChange={handleNewPasswordChange}
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
                <p className="text-sm text-gray-500 mt-1">Masukkan kembali password baru Anda untuk konfirmasi.</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-lg bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
