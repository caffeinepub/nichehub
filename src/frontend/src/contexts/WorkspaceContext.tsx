import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workspace } from '../backend';

interface WorkspaceContextType {
  workspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const WORKSPACE_STORAGE_KEY = 'nichehub-workspace';

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspaceState] = useState<Workspace>(() => {
    const stored = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    return stored === 'aiLearning' ? Workspace.aiLearning : Workspace.travel;
  });

  const setWorkspace = (newWorkspace: Workspace) => {
    setWorkspaceState(newWorkspace);
    localStorage.setItem(WORKSPACE_STORAGE_KEY, newWorkspace);
  };

  useEffect(() => {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace);
  }, [workspace]);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
