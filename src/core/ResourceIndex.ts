/**
 * Core resource index management for BOSC Community Library
 * Optimized version with caching and performance improvements
 */

import { Resource, SearchFilters, SearchResult, ResourceCategory } from '../types';
import { LRUCache } from '../utils/cache';
import { measurePerformance, PerformanceMonitor } from '../utils/performance';

export class ResourceIndex {
  private resources: Resource[] = [];
  private indexMap: Map<string, Resource> = new Map();
  private categoryIndex: Map<ResourceCategory, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private searchCache: LRUCache<SearchResult> = new LRUCache(50, 300000); // 5 minutes TTL
  private performanceMonitor: PerformanceMonitor = new PerformanceMonitor();

  constructor() {
    this.initializeIndexes();
    this.initializeDefaultResources();
  }

  /**
   * Add a resource to the index
   * Optimized: Added validation, proper indexing, and cache invalidation
   */
  @measurePerformance('addResource')
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
    
    // Update category index
    if (!this.categoryIndex.has(resource.category)) {
      this.categoryIndex.set(resource.category, new Set());
    }
    this.categoryIndex.get(resource.category)!.add(resource.id);

    // Update tag index
    resource.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(resource.id);
    });

    // Invalidate search cache
    this.searchCache.clear();
  }

  /**
   * Get resource by ID
   * Optimized: Direct map lookup with proper active resource filtering
   */
  @measurePerformance('getResourceById')
  public getResourceById(id: string): Resource | null {
    const resource = this.indexMap.get(id);
    // Return resource only if it exists and is active
    if (resource && resource.isActive) {
      return resource;
    }
    return null;
  }

  /**
   * Search resources with filters
   * Optimized: Added caching and index-based filtering for better performance
   */
  @measurePerformance('searchResources')
  public searchResources(filters: SearchFilters, page: number = 1, pageSize: number = 10): SearchResult {
    // Create cache key from filters
    const cacheKey = this.createSearchCacheKey(filters, page, pageSize);
    
    // Check cache first
    const cachedResult = this.searchCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    let candidateIds: Set<string> | null = null;

    // Use category index for efficient filtering
    if (filters.category) {
      candidateIds = this.categoryIndex.get(filters.category) || new Set();
    }

    // Use tag index for efficient filtering
    if (filters.tags && filters.tags.length > 0) {
      const tagCandidates = new Set<string>();
      filters.tags.forEach(tag => {
        const tagResources = this.tagIndex.get(tag);
        if (tagResources) {
          tagResources.forEach(id => tagCandidates.add(id));
        }
      });

      if (candidateIds) {
        // Intersection of category and tag candidates
        candidateIds = new Set([...candidateIds].filter(id => tagCandidates.has(id)));
      } else {
        candidateIds = tagCandidates;
      }
    }

    // Filter resources based on candidates or all resources
    let filteredResources: Resource[];
    
    if (candidateIds && candidateIds.size > 0) {
      filteredResources = Array.from(candidateIds)
        .map(id => this.indexMap.get(id))
        .filter((resource): resource is Resource => 
          resource !== undefined && resource.isActive
        );
    } else {
      filteredResources = this.resources.filter(resource => resource.isActive);
    }

    // Apply remaining filters
    filteredResources = this.applyRemainingFilters(filteredResources, filters);

    // Calculate pagination
    const totalCount = filteredResources.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);

    const result: SearchResult = {
      resources: paginatedResources,
      totalCount,
      page,
      pageSize
    };

    // Cache the result
    this.searchCache.set(cacheKey, result);

    return result;
  }

  /**
   * Get all active resources
   * Optimized: Direct filtering without additional processing
   */
  @measurePerformance('getAllActiveResources')
  public getAllActiveResources(): Resource[] {
    return this.resources.filter(resource => resource.isActive);
  }

  /**
   * Update resource
   * Optimized: Added index updates and cache invalidation
   */
  @measurePerformance('updateResource')
  public updateResource(id: string, updates: Partial<Resource>): boolean {
    const resource = this.indexMap.get(id);
    if (!resource) {
      return false;
    }

    const oldCategory = resource.category;
    const oldTags = [...resource.tags];

    Object.assign(resource, updates, { lastUpdated: new Date() });

    // Update category index if category changed
    if (updates.category && updates.category !== oldCategory) {
      this.categoryIndex.get(oldCategory)?.delete(id);
      if (!this.categoryIndex.has(updates.category)) {
        this.categoryIndex.set(updates.category, new Set());
      }
      this.categoryIndex.get(updates.category)!.add(id);
    }

    // Update tag index if tags changed
    if (updates.tags) {
      // Remove from old tags
      oldTags.forEach(tag => {
        this.tagIndex.get(tag)?.delete(id);
      });
      
      // Add to new tags
      updates.tags.forEach(tag => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(id);
      });
    }

    // Invalidate search cache
    this.searchCache.clear();

    return true;
  }

  /**
   * Remove resource
   * Optimized: Added index cleanup and cache invalidation
   */
  @measurePerformance('removeResource')
  public removeResource(id: string): boolean {
    const resource = this.indexMap.get(id);
    if (!resource) {
      return false;
    }

    this.resources = this.resources.filter(r => r.id !== id);
    this.indexMap.delete(id);

    // Clean up category index
    this.categoryIndex.get(resource.category)?.delete(id);

    // Clean up tag index
    resource.tags.forEach(tag => {
      this.tagIndex.get(tag)?.delete(id);
    });

    // Invalidate search cache
    this.searchCache.clear();

    return true;
  }

  /**
   * Get resources by category
   * Optimized: Use category index for O(1) lookup
   */
  @measurePerformance('getResourcesByCategory')
  public getResourcesByCategory(category: ResourceCategory): Resource[] {
    const resourceIds = this.categoryIndex.get(category);
    if (!resourceIds) {
      return [];
    }

    return Array.from(resourceIds)
      .map(id => this.indexMap.get(id))
      .filter((resource): resource is Resource => 
        resource !== undefined && resource.isActive
      );
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): any {
    return {
      searchCacheSize: this.searchCache.size(),
      totalResources: this.resources.length,
      activeResources: this.resources.filter(r => r.isActive).length,
      categoryIndexSize: this.categoryIndex.size,
      tagIndexSize: this.tagIndex.size,
      averageSearchTime: this.performanceMonitor.getAverageTime('searchResources'),
      averageAddTime: this.performanceMonitor.getAverageTime('addResource')
    };
  }

  /**
   * Clear all caches for memory management
   */
  public clearCaches(): void {
    this.searchCache.clear();
    this.performanceMonitor.clearMetrics();
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

  private initializeIndexes(): void {
    // Initialize category index with all categories
    Object.values(ResourceCategory).forEach(category => {
      this.categoryIndex.set(category, new Set());
    });
  }

  private createSearchCacheKey(filters: SearchFilters, page: number, pageSize: number): string {
    return JSON.stringify({ filters, page, pageSize });
  }

  private applyRemainingFilters(resources: Resource[], filters: SearchFilters): Resource[] {
    let filtered = resources;

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(resource => resource.language === filters.language);
    }

    // Apply government level filter
    if (filters.governmentLevel) {
      filtered = filtered.filter(resource => resource.governmentLevel === filters.governmentLevel);
    }

    // Apply WCAG compliance filter
    if (filters.wcagCompliant !== undefined) {
      filtered = filtered.filter(resource => 
        resource.accessibility.wcagCompliant === filters.wcagCompliant
      );
    }

    return filtered;
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
      
      // Update category index
      this.categoryIndex.get(resource.category)!.add(resource.id);
      
      // Update tag index
      resource.tags.forEach(tag => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(resource.id);
      });
    });
  }
}