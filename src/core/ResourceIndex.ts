/**
 * Core resource index management for BOSC Community Library
 * This file contains intentional bugs for demonstration purposes
 */

import { Resource, SearchFilters, SearchResult, ResourceCategory } from '../types';

export class ResourceIndex {
  private resources: Resource[] = [];
  private indexMap: Map<string, Resource> = new Map();

  constructor() {
    this.initializeDefaultResources();
  }

  /**
   * Add a resource to the index
   * Fixed: Added validation and proper indexMap handling
   */
  public addResource(resource: Resource): void {
    // Check for duplicates
    if (this.indexMap.has(resource.id)) {
      throw new Error(`Resource with ID ${resource.id} already exists`);
    }

    // Validate resource before adding
    const errors = this.validateResource(resource);
    if (errors.length > 0) {
      throw new Error(`Invalid resource: ${errors.join(', ')}`);
    }

    this.resources.push(resource);
    this.indexMap.set(resource.id, resource);
  }

  private validateResource(resource: Resource): string[] {
    const errors: string[] = [];
    
    if (!resource.id || resource.id.trim() === '') {
      errors.push('Resource ID is required');
    }
    
    if (!resource.title || resource.title.trim() === '') {
      errors.push('Resource title is required');
    }
    
    return errors;
  }

  /**
   * Get resource by ID
   * Fixed: Corrected logic to return active resources only
   */
  public getResourceById(id: string): Resource | null {
    const resource = this.indexMap.get(id);
    // Fixed: Return resource only if it exists and is active
    if (resource && resource.isActive) {
      return resource;
    }
    return null;
  }

  /**
   * Search resources with filters
   * Missing implementation - needs to be added as feature enhancement
   */
  public searchResources(filters: SearchFilters, page: number = 1, pageSize: number = 10): SearchResult {
    // TODO: Implement search functionality
    return {
      resources: [],
      totalCount: 0,
      page,
      pageSize
    };
  }

  /**
   * Get all active resources
   */
  public getAllActiveResources(): Resource[] {
    return this.resources.filter(resource => resource.isActive);
  }

  /**
   * Update resource
   */
  public updateResource(id: string, updates: Partial<Resource>): boolean {
    const resource = this.indexMap.get(id);
    if (!resource) {
      return false;
    }

    Object.assign(resource, updates, { lastUpdated: new Date() });
    return true;
  }

  /**
   * Remove resource
   */
  public removeResource(id: string): boolean {
    const resource = this.indexMap.get(id);
    if (!resource) {
      return false;
    }

    this.resources = this.resources.filter(r => r.id !== id);
    this.indexMap.delete(id);
    return true;
  }

  /**
   * Get resources by category
   */
  public getResourcesByCategory(category: ResourceCategory): Resource[] {
    return this.resources.filter(resource => 
      resource.category === category && resource.isActive
    );
  }

  private initializeDefaultResources(): void {
    const defaultResources: Resource[] = [
      {
        id: '1',
        title: 'Government Web Accessibility Guidelines',
        description: 'Comprehensive guide for making government websites accessible',
        category: ResourceCategory.GUIDELINES,
        url: 'https://example.gov/accessibility',
        tags: ['accessibility', 'wcag', 'government'],
        language: 'en',
        dateAdded: new Date('2024-01-01'),
        lastUpdated: new Date('2024-01-01'),
        isActive: true,
        accessibility: {
          wcagCompliant: true,
          screenReaderCompatible: true,
          keyboardNavigable: true,
          colorContrastRatio: 4.5
        }
      },
      {
        id: '2',
        title: 'Open Source Procurement Template',
        description: 'Template for government procurement of open source software',
        category: ResourceCategory.TEMPLATES,
        url: 'https://example.gov/procurement-template',
        tags: ['procurement', 'template', 'legal'],
        language: 'en',
        dateAdded: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        isActive: false, // Intentionally inactive for testing
        accessibility: {
          wcagCompliant: true,
          screenReaderCompatible: true,
          keyboardNavigable: true,
          colorContrastRatio: 4.5
        }
      }
    ];

    defaultResources.forEach(resource => {
      this.resources.push(resource);
      this.indexMap.set(resource.id, resource);
    });
  }
}