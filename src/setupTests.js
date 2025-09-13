import '@testing-library/jest-dom'; 
import { vi } from 'vitest';

vi.mock('firebase/analytics', () => ({
  getAnalytics: () => null,
  isSupported: async () => false,
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
