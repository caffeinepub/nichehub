import { useWorkspace } from '../contexts/WorkspaceContext';
import { Workspace } from '../backend';
import { Plane, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WorkspaceToggle() {
  const { workspace, setWorkspace } = useWorkspace();

  return (
    <div className="mb-6">
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <Button
          variant={workspace === Workspace.travel ? 'default' : 'ghost'}
          className="flex-1 gap-2"
          onClick={() => setWorkspace(Workspace.travel)}
        >
          <Plane className="w-4 h-4" />
          Travel
        </Button>
        <Button
          variant={workspace === Workspace.aiLearning ? 'default' : 'ghost'}
          className="flex-1 gap-2"
          onClick={() => setWorkspace(Workspace.aiLearning)}
        >
          <Brain className="w-4 h-4" />
          AI Learning
        </Button>
      </div>
    </div>
  );
}
