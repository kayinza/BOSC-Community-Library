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
   * BUG 1: Missing validation and duplicate handling
   */
  public addResource(resource: Resource): void {
    this.resources.push(resource);
    // BUG: Not updating the indexMap
    // this.indexMap.set(resource.id, resource);
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
   * Enhanced: Implemented comprehensive search functionality
   */
  public searchResources(filters: SearchFilters, page: number = 1, pageSize: number = 10): SearchResult {
    let filteredResources = this.resources.filter(resource => resource.isActive);

    // Apply category filter
    if (filters.category) {
      filteredResources = filteredResources.filter(resource => 
        resource.category === filters.category
      );
    }

    // Apply language filter
    if (filters.language) {
      filteredResources = filteredResources.filter(resource => 
        resource.language === filters.language
      );
    }

    // Apply tags filter (resource must have at least one matching tag)
    if (filters.tags && filters.tags.length > 0) {
      filteredResources = filteredResources.filter(resource => 
        filters.tags!.some(tag => resource.tags.includes(tag))
      );
    }

    // Apply government level filter
    if (filters.governmentLevel) {
      filteredResources = filteredResources.filter(resource => 
        resource.governmentLevel === filters.governmentLevel
      );
    }

    // Apply WCAG compliance filter
    if (filters.wcagCompliant !== undefined) {
      filteredResources = filteredResources.filter(resource => 
        resource.accessibility.wcagCompliant === filters.wcagCompliant
      );
    }

    // Calculate pagination
    const totalCount = filteredResources.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);

    return {
      resources: paginatedResources,
      totalCount,
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