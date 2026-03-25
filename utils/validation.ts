/**
 * Email validation using regex pattern
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation (basic - accepts 7+ digits)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7;
}

/**
 * Password strength validation
 * Returns: weak, medium, strong
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';

  // Check for mixed case
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const strengthFactors = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(
    Boolean
  ).length;

  return strengthFactors >= 3 ? 'strong' : 'medium';
}

/**
 * Validate minimum length
 */
export function isValidLength(text: string, minLength: number): boolean {
  return text.trim().length >= minLength;
}

/**
 * Validate name (letters and spaces only)
 */
export function isValidName(name: string): boolean {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim());
}

/**
 * Check if password matches confirmation
 */
export function passwordsMatch(password: string, confirmation: string): boolean {
  return password === confirmation && password.length > 0;
}

/**
 * Validate address format (basic)
 */
export function isValidAddress(address: string): boolean {
  return address.trim().length >= 5;
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if number is within range
 */
export function isNumberInRange(number: number, min: number, max: number): boolean {
  return number >= min && number <= max;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return 'Ocurrió un error desconocido';
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: { [key: string]: any }): boolean {
  return Object.keys(obj).length === 0;
}
