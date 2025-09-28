import { create } from 'zustand';

interface IUseModalStore {
    open: boolean;
    id: number | null;
    openModal: (role?: number | null) => void;
    closeModal: () => void;
}

interface IModalStore {
    modals: Record<string, { open: boolean; data?: any }>;
    openModal: (modalId: string, data?: any) => void;
    closeModal: (modalId?: string) => void;
    isOpen: (modalId: string) => boolean;
    modalData: any;
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

export const useFaceDeviceModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
}));

export const useModalStore = create<IModalStore>((set, get) => ({
    modals: {},
    modalData: null,
    openModal: (modalId: string, data?: any) => set((state) => ({
        modals: { ...state.modals, [modalId]: { open: true, data } },
        modalData: data
    })),
    closeModal: (modalId?: string) => {
        if (modalId) {
            set((state) => ({
                modals: { ...state.modals, [modalId]: { open: false } },
                modalData: null
            }));
        } else {
            set({ modals: {}, modalData: null });
        }
    },
    isOpen: (modalId: string) => {
        const state = get();
        return state.modals[modalId]?.open || false;
    }
}));