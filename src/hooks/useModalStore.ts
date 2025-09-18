import { create } from 'zustand';

interface IUseModalStore {
    open: boolean;
    id: number | null;
    openModal: (role?: number | null) => void;
    closeModal: () => void;
}
export const useUserModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
}));

export const useRoleModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
}));