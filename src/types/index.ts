/**
 * Core types for the BOSC Community Library
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
  tags: string[];
  language: string;
  dateAdded: Date;
  lastUpdated: Date;
  isActive: boolean;
  accessibility: AccessibilityInfo;
  governmentLevel?: GovernmentLevel;
}

export interface AccessibilityInfo {
  wcagCompliant: boolean;
  screenReaderCompatible: boolean;
  keyboardNavigable: boolean;
  colorContrastRatio: number;
}

export enum ResourceCategory {
  DOCUMENTATION = 'documentation',
  TOOLS = 'tools',
  TEMPLATES = 'templates',
  GUIDELINES = 'guidelines',
  TRAINING = 'training',
  CASE_STUDIES = 'case-studies'
}

export enum GovernmentLevel {
  FEDERAL = 'federal',
  STATE = 'state',
  LOCAL = 'local',
  INTERNATIONAL = 'international'
}

export interface SearchFilters {
  category?: ResourceCategory;
  language?: string;
  tags?: string[];
  governmentLevel?: GovernmentLevel;
  wcagCompliant?: boolean;
}

export interface SearchResult {
  resources: Resource[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface LocalizationConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  fallbackLanguage: string;
}

export interface Translation {
  key: string;
  language: string;
  value: string;
  context?: string;
}