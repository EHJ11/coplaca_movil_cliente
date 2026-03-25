import { useState } from 'react';

export interface PaymentValidation {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface PaymentErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export interface UsePaymentValidationReturn {
  validate: (payment: PaymentValidation) => PaymentErrors;
  isValidCard: (cardNumber: string) => boolean;
  isValidExpiry: (expiryDate: string) => boolean;
  isValidCVV: (cvv: string) => boolean;
  isValidCardholder: (name: string) => boolean;
  formatCardNumber: (cardNumber: string) => string;
  formatExpiryDate: (date: string) => string;
}

export function usePaymentValidation(): UsePaymentValidationReturn {
  const isValidCard = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\D/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19;
  };

  const isValidExpiry = (expiryDate: string): boolean => {
    const [month, year] = expiryDate.split('/').map((s) => s.trim());

    if (!month || !year) return false;

    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) return false;

    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear() % 100;

    if (yearNum < currentYear) return false;

    return true;
  };

  const isValidCVV = (cvv: string): boolean => {
    const cleaned = cvv.replace(/\D/g, '');
    return cleaned.length >= 3 && cleaned.length <= 4;
  };

  const isValidCardholder = (name: string): boolean => {
    return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
  };

  const formatCardNumber = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (date: string): string => {
    const cleaned = date.replace(/\D/g, '');

    if (cleaned.length <= 2) {
      return cleaned;
    }

    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const validate = (payment: PaymentValidation): PaymentErrors => {
    const errors: PaymentErrors = {};

    if (!isValidCard(payment.cardNumber)) {
      errors.cardNumber = 'Número de tarjeta inválido (13-19 dígitos)';
    }

    if (!isValidExpiry(payment.expiryDate)) {
      errors.expiryDate = 'Fecha válida (MM/YY) o vencida';
    }

    if (!isValidCVV(payment.cvv)) {
      errors.cvv = 'CVV inválido (3-4 dígitos)';
    }

    if (!isValidCardholder(payment.cardholderName)) {
      errors.cardholderName = 'Nombre requerido (mínimo 3 caracteres)';
    }

    return errors;
  };

  return {
    validate,
    isValidCard,
    isValidExpiry,
    isValidCVV,
    isValidCardholder,
    formatCardNumber,
    formatExpiryDate,
  };
}
