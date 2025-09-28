import { create } from 'zustand';

interface IUseViewUserModal {
    open: boolean;
    userId: number | null;
    openModal: (id?: number | null) => void;
    closeModal: () => void;
}
export const useViewUserModal = create<IUseViewUserModal>((set) => ({
    open: false,
    userId: null,
    openModal: (id = null) => set({ open: true, userId: id }),
    closeModal: () => set({ open: false, userId: null }),
}));

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

interface IUseViewFaceDeviceModal {
    open: boolean;
    id: number | null;
    openModal: (id?: number | null) => void;
    closeModal: () => void;
}

export const useViewFaceDeviceModal = create<IUseViewFaceDeviceModal>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
}));