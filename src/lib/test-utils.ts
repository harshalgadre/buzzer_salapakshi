// Test utilities for password change functionality

export async function testPasswordChange() {
  const testData = {
    currentPassword: 'oldpassword123',
    newPassword: 'newpassword456'
  };

  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper to check if user can change password (not OAuth user)
export function canChangePassword(userData: { provider?: string } | null): boolean {
  return userData?.provider === 'local' || !userData?.provider;
}