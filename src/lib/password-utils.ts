// Password validation utilities

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long');
    }

    // Check for at least one letter and one number (optional stronger validation)
    // if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    //   errors.push('Password must contain at least one letter and one number');
    // }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): PasswordValidationResult {
  const errors: string[] = [];

  // Validate current password
  if (!currentPassword || currentPassword.trim().length === 0) {
    errors.push('Current password is required');
  }

  // Validate new password
  const newPasswordValidation = validatePassword(newPassword);
  if (!newPasswordValidation.isValid) {
    errors.push(...newPasswordValidation.errors.map(error => error.replace('Password', 'New password')));
  }

  // Check password confirmation
  if (!confirmPassword || confirmPassword.trim().length === 0) {
    errors.push('Password confirmation is required');
  } else if (newPassword !== confirmPassword) {
    errors.push('New passwords do not match');
  }

  // Check if new password is different from current
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('New password must be different from current password');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generatePasswordStrengthText(password: string): string {
  if (!password) return '';
  
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  let score = 0;
  if (length >= 6) score++;
  if (length >= 10) score++;
  if (hasLower) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  
  if (score <= 2) return 'Weak';
  if (score <= 4) return 'Medium';
  return 'Strong';
}