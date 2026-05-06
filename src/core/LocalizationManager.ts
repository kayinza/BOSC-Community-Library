/**
 * Localization Manager for BOSC Community Library
 * Supports multiple languages for government and public sector use
 */

import { LocalizationConfig, Translation } from '../types';

export class LocalizationManager {
  private config: LocalizationConfig;
  private translations: Map<string, Map<string, string>> = new Map();
  private currentLanguage: string;

  constructor(config: LocalizationConfig) {
    this.config = config;
    this.currentLanguage = config.defaultLanguage;
    this.initializeDefaultTranslations();
  }

  /**
   * Set the current language
   */
  public setLanguage(language: string): void {
    if (!this.config.supportedLanguages.includes(language)) {
      throw new Error(`Language ${language} is not supported`);
    }
    this.currentLanguage = language;
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): string[] {
    return [...this.config.supportedLanguages];
  }

  /**
   * Translate a key to the current language
   */
  public translate(key: string, params?: Record<string, string>): string {
    const languageTranslations = this.translations.get(this.currentLanguage);
    let translation = languageTranslations?.get(key);

    // Fallback to default language if translation not found
    if (!translation) {
      const fallbackTranslations = this.translations.get(this.config.fallbackLanguage);
      translation = fallbackTranslations?.get(key);
    }

    // Return key if no translation found
    if (!translation) {
      return key;
    }

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation!.replace(`{{${param}}}`, value);
      });
    }

    return translation;
  }

  /**
   * Add translation for a specific language
   */
  public addTranslation(language: string, key: string, value: string): void {
    if (!this.translations.has(language)) {
      this.translations.set(language, new Map());
    }
    
    const languageTranslations = this.translations.get(language)!;
    languageTranslations.set(key, value);
  }

  /**
   * Add multiple translations for a language
   */
  public addTranslations(language: string, translations: Record<string, string>): void {
    Object.entries(translations).forEach(([key, value]) => {
      this.addTranslation(language, key, value);
    });
  }

  /**
   * Get all translations for a language
   */
  public getTranslations(language: string): Record<string, string> {
    const languageTranslations = this.translations.get(language);
    if (!languageTranslations) {
      return {};
    }

    const result: Record<string, string> = {};
    languageTranslations.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  /**
   * Check if a language is supported
   */
  public isLanguageSupported(language: string): boolean {
    return this.config.supportedLanguages.includes(language);
  }

  /**
   * Get localized resource title and description
   */
  public localizeResourceContent(resourceId: string, title: string, description: string): { title: string; description: string } {
    const localizedTitle = this.translate(`resource.${resourceId}.title`) || title;
    const localizedDescription = this.translate(`resource.${resourceId}.description`) || description;

    return {
      title: localizedTitle,
      description: localizedDescription
    };
  }

  private initializeDefaultTranslations(): void {
    // English translations
    this.addTranslations('en', {
      'app.title': 'BOSC Community Library',
      'app.description': 'A professional open source library for public sector transparency',
      'search.placeholder': 'Search resources...',
      'search.results': 'Found {{count}} resources',
      'search.no_results': 'No resources found',
      'category.documentation': 'Documentation',
      'category.tools': 'Tools',
      'category.templates': 'Templates',
      'category.guidelines': 'Guidelines',
      'category.training': 'Training',
      'category.case_studies': 'Case Studies',
      'accessibility.wcag_compliant': 'WCAG Compliant',
      'accessibility.screen_reader': 'Screen Reader Compatible',
      'accessibility.keyboard_nav': 'Keyboard Navigable',
      'government.federal': 'Federal',
      'government.state': 'State',
      'government.local': 'Local',
      'government.international': 'International',
      'error.resource_not_found': 'Resource not found',
      'error.invalid_language': 'Invalid language selected'
    });

    // Spanish translations
    this.addTranslations('es', {
      'app.title': 'Biblioteca Comunitaria BOSC',
      'app.description': 'Una biblioteca de código abierto profesional para la transparencia del sector público',
      'search.placeholder': 'Buscar recursos...',
      'search.results': 'Se encontraron {{count}} recursos',
      'search.no_results': 'No se encontraron recursos',
      'category.documentation': 'Documentación',
      'category.tools': 'Herramientas',
      'category.templates': 'Plantillas',
      'category.guidelines': 'Directrices',
      'category.training': 'Capacitación',
      'category.case_studies': 'Casos de Estudio',
      'accessibility.wcag_compliant': 'Compatible con WCAG',
      'accessibility.screen_reader': 'Compatible con Lector de Pantalla',
      'accessibility.keyboard_nav': 'Navegable por Teclado',
      'government.federal': 'Federal',
      'government.state': 'Estatal',
      'government.local': 'Local',
      'government.international': 'Internacional',
      'error.resource_not_found': 'Recurso no encontrado',
      'error.invalid_language': 'Idioma seleccionado inválido'
    });

    // French translations
    this.addTranslations('fr', {
      'app.title': 'Bibliothèque Communautaire BOSC',
      'app.description': 'Une bibliothèque open source professionnelle pour la transparence du secteur public',
      'search.placeholder': 'Rechercher des ressources...',
      'search.results': '{{count}} ressources trouvées',
      'search.no_results': 'Aucune ressource trouvée',
      'category.documentation': 'Documentation',
      'category.tools': 'Outils',
      'category.templates': 'Modèles',
      'category.guidelines': 'Directives',
      'category.training': 'Formation',
      'category.case_studies': 'Études de Cas',
      'accessibility.wcag_compliant': 'Conforme WCAG',
      'accessibility.screen_reader': 'Compatible Lecteur d\'Écran',
      'accessibility.keyboard_nav': 'Navigation au Clavier',
      'government.federal': 'Fédéral',
      'government.state': 'État',
      'government.local': 'Local',
      'government.international': 'International',
      'error.resource_not_found': 'Ressource non trouvée',
      'error.invalid_language': 'Langue sélectionnée invalide'
    });
  }
}