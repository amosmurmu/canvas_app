import { create } from 'zustand'

export type InspectorTab = 'config' | 'runtime'

interface AppState {
  selectedAppId: string
  selectedNodeId: string | null
  isMobilePanelOpen: boolean
  activeInspectorTab: InspectorTab

  // Actions
  setSelectedApp: (appId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  setActiveInspectorTab: (tab: InspectorTab) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedAppId: 'supertokens-golang',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',

  setSelectedApp: (appId) =>
    set({ selectedAppId: appId, selectedNodeId: null }),

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  toggleMobilePanel: () =>
    set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),

  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),

  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}))
