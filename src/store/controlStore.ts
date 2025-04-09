import { create } from 'zustand';
interface ControlStore {
  component:string
  setComponet: (component:string) => void;
  translateX: number;
  translateY: number;
  togglePosition:()=>void;
}
export const useControlStore = create<ControlStore>((set) => ({
  component:'Discovery',
  setComponet: (component) => set({ component }),
  translateX: 0,
  translateY: 0,
  togglePosition: () =>
    set((state) => ({
      translateX: state.translateX === 0 ? 100 : 0,


      
      translateY: state.translateY === 0 ? 100 : 0,
    })),
}))
