// local instance of user (to be shared amongst different react components)

import { create } from 'zustand';
import { User } from '@/types/user';

interface UserStoreProp {
  user: User | null; 
  setUser: (newQuestion: User | null) => void;
}

export const useUserStore = create<UserStoreProp>((set) => ({
  user: null,
  setUser: (newData: User | null) =>
    set(() => ({ user: newData })),
}));
