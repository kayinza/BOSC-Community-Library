/**
 * Tests for search functionality
 */

import { ResourceIndex } from '../core/ResourceIndex';
import { ResourceCategory, GovernmentLevel } from '../types';

describe('Search Functionality', () => {
  let resourceIndex: ResourceIndex;

  beforeEach(() => {
    resourceIndex = new ResourceIndex();
  });

  describe('searchResources', () => {
    it('should return all active resources when no filters applied', () => {
      const result = resourceIndex.searchResources({});
      expect(result.resources.length).toBeGreaterThan(0);
      expect(result.totalCount).toBeGreaterThan(0);
      result.resources.forEach(resource => {
        expect(resource.isActive).toBe(true);
      });
    });

    it('should filter by category', () => {
      const result = resourceIndex.searchResources({
        category: ResourceCategory.GUIDELINES
      });
      
      result.resources.forEach(resource => {
        expect(resource.category).toBe(ResourceCategory.GUIDELINES);
      });
    });

    it('should filter by language', () => {
      const result = resourceIndex.searchResources({
        language: 'en'
      });
      
      result.resources.forEach(resource => {
        expect(resource.language).toBe('en');
      });
    });

    it('should filter by tags', () => {
      const result = resourceIndex.searchResources({
        tags: ['accessibility']
      });
      
      result.resources.forEach(resource => {
        expect(resource.tags).toContain('accessibility');
      });
    });

    it('should filter by WCAG compliance', () => {
      const result = resourceIndex.searchResources({
        wcagCompliant: true
      });
      
      result.resources.forEach(resource => {
        expect(resource.accessibility.wcagCompliant).toBe(true);
      });
    });

    it('should handle pagination correctly', () => {
      const pageSize = 1;
      const result = resourceIndex.searchResources({}, 1, pageSize);
      
      expect(result.resources.length).toBeLessThanOrEqual(pageSize);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(pageSize);
    });

    it('should combine multiple filters', () => {
      const result = resourceIndex.searchResources({
        category: ResourceCategory.GUIDELINES,
        language: 'en',
        wcagCompliant: true
      });
      
      result.resources.forEach(resource => {
        expect(resource.category).toBe(ResourceCategory.GUIDELINES);
        expect(resource.language).toBe('en');
        expect(resource.accessibility.wcagCompliant).toBe(true);
      });
    });
  });
});