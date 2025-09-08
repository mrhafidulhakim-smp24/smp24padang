// src/app/admin/profile/actions.ts

'use server';

import { revalidatePath } from 'next/cache';

// Placeholder for fetching current profile data
export async function getProfile() {
  // In a real application, you would fetch the actual user profile from your database
  // based on the authenticated user's ID.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return {
    username: 'admin_user',
    email: 'admin@example.com',
  };
}

export async function updateProfile(formData: FormData) {
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  // --- Placeholder for actual server-side logic and database interaction ---

  // 1. Fetch current user data (including hashed password) from database
  //    For demonstration, let's assume a hardcoded current password for verification.
  //    In a real app, you'd fetch the user's actual hashed password from your DB.
  const storedHashedPassword = 'hashed_current_password_from_db'; // Replace with actual fetched hashed password

  // 2. Verify old password (IMPORTANT: Use a proper hashing library like bcrypt in production)
  //    For this example, we'll do a simple string comparison.
  //    In production: const isOldPasswordValid = await bcrypt.compare(oldPassword, storedHashedPassword);
  if (oldPassword !== 'current_password_123') { // Replace 'current_password_123' with actual verification logic
    return { success: false, message: 'Password lama salah.' };
  }

  // 3. Validate new password
  if (newPassword && newPassword.length < 8) {
    return { success: false, message: 'Password baru minimal 8 karakter.' };
  }
  if (newPassword && newPassword !== confirmNewPassword) {
    return { success: false, message: 'Konfirmasi password baru tidak cocok.' };
  }
  if (newPassword && newPassword === oldPassword) {
    return { success: false, message: 'Password baru tidak boleh sama dengan password lama.' };
  }

  // 4. Simulate database update
  //    In a real application, you would:
  //    - Hash the newPassword: const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
  //    - Update username, email, and hashedNewPassword in the database.
  console.log('Simulating profile update with:', { username, email, newPassword: newPassword ? '*****' : 'no_change' });

  // Simulate a delay for network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate success or failure based on some condition (e.g., if newPassword was provided)
  if (newPassword && newPassword.length > 0) {
    // If password was changed, simulate success
    revalidatePath('/admin/profile'); // Revalidate the path to refresh data
    return { success: true, message: 'Profil dan password berhasil diperbarui!' };
  } else {
    // If only username/email were changed, simulate success
    revalidatePath('/admin/profile'); // Revalidate the path to refresh data
    return { success: true, message: 'Profil berhasil diperbarui!' };
  }

  // --- End of Placeholder ---
}