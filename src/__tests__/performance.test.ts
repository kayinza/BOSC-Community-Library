/**
 * Performance tests for optimized ResourceIndex
 */

import { ResourceIndex } from '../core/ResourceIndex';
import { Resource, ResourceCategory } from '../types';
import { LRUCache } from '../utils/cache';

describe('Performance Optimization', () => {
  let resourceIndex: ResourceIndex;

  beforeEach(() => {
    resourceIndex = new ResourceIndex();
  });

  describe('LRUCache', () => {
    let cache: LRUCache<string>;

    beforeEach(() => {
      cache = new LRUCache<string>(3, 1000); // Small cache for testing
    });

    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should evict least recently used items when at capacity', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict key1

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('should handle TTL expiration', (done) => {
      cache.set('key1', 'value1', 50); // 50ms TTL
      
      setTimeout(() => {
        expect(cache.get('key1')).toBeNull();
        done();
      }, 100);
    });

    it('should update LRU order on access', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      // Access key1 to make it most recently used
      cache.get('key1');
      
      // Add key4, should evict key2 (least recently used)
      cache.set('key4', 'value4');
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });
  });

  describe('ResourceIndex Performance', () => {
    it('should provide performance metrics', () => {
      const metrics = resourceIndex.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('searchCacheSize');
      expect(metrics).toHaveProperty('totalResources');
      expect(metrics).toHaveProperty('activeResources');
      expect(metrics).toHaveProperty('categoryIndexSize');
      expect(metrics).toHaveProperty('tagIndexSize');
    });

    it('should use category index for efficient filtering', () => {
      // Add multiple resources to test indexing
      const resources: Resource[] = [];
      for (let i = 0; i < 100; i++) {
        resources.push({
          id: `test-${i}`,
          title: `Test Resource ${i}`,
          description: `Description ${i}`,
          category: i % 2 === 0 ? ResourceCategory.DOCUMENTATION : ResourceCategory.TOOLS,
          url: `https://example.com/${i}`,
          tags: [`tag${i % 5}`],
          language: 'en',
          dateAdded: new Date(),
          lastUpdated: new Date(),
          isActive: true,
          accessibility: {
            wcagCompliant: true,
            screenReaderCompatible: true,
            keyboardNavigable: true,
            colorContrastRatio: 4.5
          }
        });
      }

      // Add resources
      resources.forEach(resource => resourceIndex.addResource(resource));

      // Test category-based search performance
      const startTime = performance.now();
      const result = resourceIndex.searchResources({
        category: ResourceCategory.DOCUMENTATION
      });
      const endTime = performance.now();

      expect(result.resources.length).toBe(50); // Half should be documentation
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast with indexing
    });

    it('should cache search results', () => {
      // First search
      const result1 = resourceIndex.searchResources({
        category: ResourceCategory.GUIDELINES
      });

      // Second identical search should use cache
      const result2 = resourceIndex.searchResources({
        category: ResourceCategory.GUIDELINES
      });

      expect(result1).toEqual(result2);
    });

    it('should invalidate cache when resources are modified', () => {
      // Initial search to populate cache
      const initialResult = resourceIndex.searchResources({});
      const initialCount = initialResult.totalCount;

      // Add a new resource
      const newResource: Resource = {
        id: 'cache-test',
        title: 'Cache Test Resource',
        description: 'Testing cache invalidation',
        category: ResourceCategory.DOCUMENTATION,
        url: 'https://example.com/cache-test',
        tags: ['cache', 'test'],
        language: 'en',
        dateAdded: new Date(),
        lastUpdated: new Date(),
        isActive: true,
        accessibility: {
          wcagCompliant: true,
          screenReaderCompatible: true,
          keyboardNavigable: true,
          colorContrastRatio: 4.5
        }
      };

      resourceIndex.addResource(newResource);

      // Search again - should reflect the new resource
      const updatedResult = resourceIndex.searchResources({});
      expect(updatedResult.totalCount).toBe(initialCount + 1);
    });
  });
});