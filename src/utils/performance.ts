/**
 * Performance monitoring and optimization utilities
 */

export interface PerformanceMetrics {
  operationName: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private activeOperations: Map<string, number> = new Map();

  public startOperation(operationName: string): string {
    const operationId = `${operationName}_${Date.now()}_${Math.random()}`;
    this.activeOperations.set(operationId, performance.now());
    return operationId;
  }

  public endOperation(operationId: string, metadata?: Record<string, any>): PerformanceMetrics | null {
    const startTime = this.activeOperations.get(operationId);
    if (!startTime) {
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const operationName = operationId.split('_')[0];

    const metric: PerformanceMetrics = {
      operationName,
      duration,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    this.activeOperations.delete(operationId);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    return metric;
  }

  public getMetrics(operationName?: string): PerformanceMetrics[] {
    if (operationName) {
      return this.metrics.filter(m => m.operationName === operationName);
    }
    return [...this.metrics];
  }

  public getAverageTime(operationName: string): number {
    const operationMetrics = this.getMetrics(operationName);
    if (operationMetrics.length === 0) {
      return 0;
    }

    const totalTime = operationMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return totalTime / operationMetrics.length;
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.activeOperations.clear();
  }
}

// Decorator for automatic performance monitoring
export function measurePerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const monitor = new PerformanceMonitor();

    descriptor.value = function (...args: any[]) {
      const name = operationName || `${target.constructor.name}.${propertyName}`;
      const operationId = monitor.startOperation(name);
      
      try {
        const result = method.apply(this, args);
        
        // Handle async methods
        if (result instanceof Promise) {
          return result.finally(() => {
            monitor.endOperation(operationId, { args: args.length });
          });
        }
        
        monitor.endOperation(operationId, { args: args.length });
        return result;
      } catch (error) {
        monitor.endOperation(operationId, { args: args.length, error: true });
        throw error;
      }
    };

    return descriptor;
  };
}

// Utility for debouncing expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility for throttling operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}