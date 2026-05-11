/**
 * Tests for LocalizationManager
 */

import { LocalizationManager } from '../core/LocalizationManager';
import { LocalizationConfig } from '../types';

describe('LocalizationManager', () => {
  let localizationManager: LocalizationManager;
  let config: LocalizationConfig;

  beforeEach(() => {
    config = {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'es', 'fr'],
      fallbackLanguage: 'en'
    };
    localizationManager = new LocalizationManager(config);
  });

  describe('language management', () => {
    it('should initialize with default language', () => {
      expect(localizationManager.getCurrentLanguage()).toBe('en');
    });

    it('should set supported language', () => {
      localizationManager.setLanguage('es');
      expect(localizationManager.getCurrentLanguage()).toBe('es');
    });

    it('should throw error for unsupported language', () => {
      expect(() => {
        localizationManager.setLanguage('de');
      }).toThrow('Language de is not supported');
    });

    it('should return supported languages', () => {
      const languages = localizationManager.getSupportedLanguages();
      expect(languages).toEqual(['en', 'es', 'fr']);
    });

    it('should check if language is supported', () => {
      expect(localizationManager.isLanguageSupported('en')).toBe(true);
      expect(localizationManager.isLanguageSupported('de')).toBe(false);
    });
  });

  describe('translation', () => {
    it('should translate keys in current language', () => {
      const translation = localizationManager.translate('app.title');
      expect(translation).toBe('BOSC Community Library');
    });

    it('should translate keys in different language', () => {
      localizationManager.setLanguage('es');
      const translation = localizationManager.translate('app.title');
      expect(translation).toBe('Biblioteca Comunitaria BOSC');
    });

    it('should fallback to default language when translation missing', () => {
      localizationManager.setLanguage('es');
      localizationManager.addTranslation('en', 'test.key', 'Test Value');
      
      const translation = localizationManager.translate('test.key');
      expect(translation).toBe('Test Value');
    });

    it('should return key when no translation found', () => {
      const translation = localizationManager.translate('nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });

    it('should replace parameters in translations', () => {
      const translation = localizationManager.translate('search.results', { count: '5' });
      expect(translation).toBe('Found 5 resources');
    });
  });

  describe('translation management', () => {
    it('should add single translation', () => {
      localizationManager.addTranslation('en', 'test.key', 'Test Value');
      const translation = localizationManager.translate('test.key');
      expect(translation).toBe('Test Value');
    });

    it('should add multiple translations', () => {
      localizationManager.addTranslations('en', {
        'test.key1': 'Test Value 1',
        'test.key2': 'Test Value 2'
      });

      expect(localizationManager.translate('test.key1')).toBe('Test Value 1');
      expect(localizationManager.translate('test.key2')).toBe('Test Value 2');
    });

    it('should get all translations for a language', () => {
      localizationManager.addTranslations('test', {
        'key1': 'value1',
        'key2': 'value2'
      });

      const translations = localizationManager.getTranslations('test');
      expect(translations).toEqual({
        'key1': 'value1',
        'key2': 'value2'
      });
    });
  });

  describe('resource localization', () => {
    it('should localize resource content', () => {
      localizationManager.addTranslations('en', {
        'resource.test-1.title': 'Localized Title',
        'resource.test-1.description': 'Localized Description'
      });

      const localized = localizationManager.localizeResourceContent(
        'test-1',
        'Original Title',
        'Original Description'
      );

      expect(localized.title).toBe('Localized Title');
      expect(localized.description).toBe('Localized Description');
    });

    it('should fallback to original content when no localization exists', () => {
      const localized = localizationManager.localizeResourceContent(
        'test-1',
        'Original Title',
        'Original Description'
      );

      expect(localized.title).toBe('Original Title');
      expect(localized.description).toBe('Original Description');
    });
  });
});