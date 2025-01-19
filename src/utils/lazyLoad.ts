// src/utils/lazyLoad.ts
import { lazy, ComponentType } from 'react';

interface LazyLoadOptions {
  readonly retry?: number;
  readonly retryDelay?: number;
}

export const lazyLoad = <T extends ComponentType<any>>(
  importPromise: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) => {
  const { retry = 1, retryDelay = 1000 } = options;

  const retryImport = (attemptsLeft: number, delay: number): Promise<{ default: T }> => {
    return importPromise().catch((error: Error) => {
      if (attemptsLeft <= 1) {
        console.error('Lazy load failed after retries:', error);
        return Promise.reject(error);
      }
      return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
        retryImport(attemptsLeft - 1, delay)
      );
    });
  };

  return lazy(() => retryImport(retry, retryDelay));
};
