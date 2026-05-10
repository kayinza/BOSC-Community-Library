/**
 * BOSC Community Library - Main Entry Point
 * A professional open source library for public sector transparency
 */

export { ResourceIndex } from './core/ResourceIndex';
export { LocalizationManager } from './core/LocalizationManager';
export { validateResource, validateAccessibility, ValidationError } from './utils/validation';
export { LRUCache } from './utils/cache';
export { PerformanceMonitor, measurePerformance, debounce, throttle } from './utils/performance';
export * from './types';

// Version information
export const VERSION = '1.0.0';
export const LIBRARY_NAME = 'BOSC Community Library';