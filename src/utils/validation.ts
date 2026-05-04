/**
 * Validation utilities for BOSC Community Library
 */

import { Resource, AccessibilityInfo } from '../types';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateResource(resource: Partial<Resource>): string[] {
  const errors: string[] = [];

  if (!resource.id || resource.id.trim() === '') {
    errors.push('Resource ID is required');
  }

  if (!resource.title || resource.title.trim() === '') {
    errors.push('Resource title is required');
  }

  if (!resource.description || resource.description.trim() === '') {
    errors.push('Resource description is required');
  }

  if (!resource.url || !isValidUrl(resource.url)) {
    errors.push('Valid resource URL is required');
  }

  if (!resource.category) {
    errors.push('Resource category is required');
  }

  if (!resource.language || resource.language.length !== 2) {
    errors.push('Valid language code (2 characters) is required');
  }

  if (resource.accessibility) {
    const accessibilityErrors = validateAccessibility(resource.accessibility);
    errors.push(...accessibilityErrors);
  }

  return errors;
}

export function validateAccessibility(accessibility: AccessibilityInfo): string[] {
  const errors: string[] = [];

  if (typeof accessibility.wcagCompliant !== 'boolean') {
    errors.push('WCAG compliance status must be a boolean');
  }

  if (typeof accessibility.screenReaderCompatible !== 'boolean') {
    errors.push('Screen reader compatibility must be a boolean');
  }

  if (typeof accessibility.keyboardNavigable !== 'boolean') {
    errors.push('Keyboard navigation status must be a boolean');
  }

  if (typeof accessibility.colorContrastRatio !== 'number' || 
      accessibility.colorContrastRatio < 1 || 
      accessibility.colorContrastRatio > 21) {
    errors.push('Color contrast ratio must be a number between 1 and 21');
  }

  return errors;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}