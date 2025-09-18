import { create } from "zustand";


interface IDeleteConfirmStore {
  id: number | null;
  setDeleteId: (id: number | null) => void;
}


export const useConfirmDeleteStore = create<IDeleteConfirmStore>((set) => ({
  id: null,
  setDeleteId: (id: number | null) => set({ id: id }),
}));