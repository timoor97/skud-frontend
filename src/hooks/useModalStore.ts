import { create } from 'zustand';

interface IUseModalStore {
    open: boolean;
    id: number | null;
    openModal: (role?: number | null) => void;
    closeModal: () => void;
    onSuccess?: () => void
    setOnSuccess: (cb: () => void) => void

}

interface IModalStore {
    modals: Record<string, { open: boolean; data?: unknown }>;
    openModal: (modalId: string, data?: unknown) => void;
    closeModal: (modalId?: string) => void;
    isOpen: (modalId: string) => boolean;
    modalData: unknown;
}

export const useUserModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    openModal: (id = null) => set({ open: true, id: id }),
    onSuccess: undefined,
    closeModal: () => set({ open: false, id: null }),
    setOnSuccess: (cb) => set({ onSuccess: cb }),
}));

export const useRoleModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    onSuccess: undefined,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
    setOnSuccess: (cb) => set({ onSuccess: cb }),
}));

export const useFaceDeviceModalStore = create<IUseModalStore>((set) => ({
    open: false,
    id: null,
    onSuccess: undefined,
    openModal: (id = null) => set({ open: true, id: id }),
    closeModal: () => set({ open: false, id: null }),
    setOnSuccess: (cb) => set({ onSuccess: cb }),
}));

export const useModalStore = create<IModalStore>((set, get) => ({
    modals: {},
    modalData: null,
    openModal: (modalId: string, data?: unknown) => set((state) => ({
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