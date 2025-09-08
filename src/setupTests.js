import '@testing-library/jest-dom'; 

import { vi } from 'vitest';
vi.mock('firebase/analytics', () => ({
  getAnalytics: () => null,
  isSupported: async () => false,
}));
