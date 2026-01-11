import { create } from 'zustand';
import { UserType } from '../schemas/auth';

interface AuthState {
  type?: UserType;
  setType: (type: UserType) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  type: undefined,
  setType: (type) => set({ type }),
  clear: () => set({ type: undefined }),
}));
