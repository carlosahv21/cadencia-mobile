// Form validation utilities

export const validation = {
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Password validation
  isValidPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Required field validation
  isRequired(value: string): boolean {
    return value.trim().length > 0;
  },

  // Get email error message
  getEmailError(email: string): string | null {
    if (!this.isRequired(email)) {
      return 'El email es requerido';
    }
    if (!this.isValidEmail(email)) {
      return 'Email inválido';
    }
    return null;
  },

  // Get password error message
  getPasswordError(password: string): string | null {
    if (!this.isRequired(password)) {
      return 'La contraseña es requerida';
    }
    const validation = this.isValidPassword(password);
    if (!validation.valid) {
      return validation.errors[0];
    }
    return null;
  },
};
