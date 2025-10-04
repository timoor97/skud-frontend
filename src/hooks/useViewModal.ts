import { create } from 'zustand';

interface IUseViewRoleModal {
    open: boolean;
    id: number | null;
    openModal: (id?: number | null) => void;
    closeModal: () => void;
}

export const useViewRoleModal = create<IUseViewRoleModal>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
}));
