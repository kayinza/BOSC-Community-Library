/**
 * Test setup configuration for BOSC Community Library
 */

// Global test configuration
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Date for consistent testing
const mockDate = new Date('2024-01-01T00:00:00.000Z');
global.Date = jest.fn(() => mockDate) as any;
global.Date.now = jest.fn(() => mockDate.getTime());

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});