import { create } from 'zustand'

export const useRobotStore = create((set) => ({
  activeSection: 'header',
  lastValidSection: 'header',
  setActiveSection: (section) => set((state) => {
    if (section) {
      return { activeSection: section, lastValidSection: section }
    } else {
      return { activeSection: null }
    }
  }),
}))
