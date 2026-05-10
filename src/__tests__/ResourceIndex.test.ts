/**
 * Tests for ResourceIndex - demonstrating the bugs that need to be fixed
 */

import { ResourceIndex } from '../core/ResourceIndex';
import { Resource, ResourceCategory } from '../types';

describe('ResourceIndex', () => {
  let resourceIndex: ResourceIndex;

  beforeEach(() => {
    resourceIndex = new ResourceIndex();
  });

  describe('addResource', () => {
    it('should add a resource to the index', () => {
      const resource: Resource = {
        id: 'test-1',
        title: 'Test Resource',
        description: 'A test resource',
        category: ResourceCategory.DOCUMENTATION,
        url: 'https://example.com',
        tags: ['test'],
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

      resourceIndex.addResource(resource);
      
      // This test will fail due to Bug 1: indexMap not being updated
      const retrieved = resourceIndex.getResourceById('test-1');
      expect(retrieved).toBeTruthy();
      expect(retrieved?.title).toBe('Test Resource');
    });
  });

  describe('getResourceById', () => {
    it('should return active resources', () => {
      // This test will fail due to Bug 2: inverted logic for active resources
      const activeResource = resourceIndex.getResourceById('1');
      expect(activeResource).toBeTruthy();
      expect(activeResource?.isActive).toBe(true);
    });

    it('should not return inactive resources', () => {
      // This test will fail due to Bug 2: inverted logic for active resources
      const inactiveResource = resourceIndex.getResourceById('2');
      expect(inactiveResource).toBeNull();
    });
  });

  describe('searchResources', () => {
    it('should return empty results when not implemented', () => {
      const result = resourceIndex.searchResources({});
      expect(result.resources).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });
  });

  describe('getAllActiveResources', () => {
    it('should return only active resources', () => {
      const activeResources = resourceIndex.getAllActiveResources();
      expect(activeResources.length).toBeGreaterThan(0);
      activeResources.forEach(resource => {
        expect(resource.isActive).toBe(true);
      });
    });
  });
});