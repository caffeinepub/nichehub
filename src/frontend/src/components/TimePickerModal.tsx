import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useSchedulePost, useVideos } from '../hooks/useQueries';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { Platform, Caption } from '../backend';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { generateCaptions } from '../utils/captionGenerator';
import { Loader2 } from 'lucide-react';

interface TimePickerModalProps {
  open: boolean;
  onClose: () => void;
  date: Date;
  videoId: string;
  workspace: string;
}

export default function TimePickerModal({ open, onClose, date, videoId, workspace: videoWorkspace }: TimePickerModalProps) {
  const { workspace } = useWorkspace();
  const { data: videos } = useVideos(workspace);
  const { mutate: schedulePost, isPending } = useSchedulePost();
  const [time, setTime] = useState('12:00');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.facebook,
    Platform.instagram,
    Platform.tiktok,
  ]);
  const [captions, setCaptions] = useState<Caption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const video = videos?.find((v) => v.id === videoId);

  const handleGenerateCaptions = async () => {
    if (!video) return;
    setIsGenerating(true);
    try {
      const generated = await generateCaptions(video.caption || '', workspace);
      setCaptions(generated);
    } catch (error) {
      console.error('Failed to generate captions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleConfirm = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    if (!captions) {
      await handleGenerateCaptions();
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const finalDate = new Date(date);
    finalDate.setHours(hours, minutes, 0, 0);

    if (finalDate < new Date()) {
      toast.error('Please select a future time');
      return;
    }

    schedulePost(
      {
        videoId,
        workspace: workspace,
        platforms: selectedPlatforms,
        captions,
        scheduledTime: BigInt(finalDate.getTime() * 1000000),
      },
      {
        onSuccess: () => {
          toast.success('Post scheduled for planning! Remember to manually post at the scheduled time.');
          onClose();
        },
        onError: () => {
          toast.error('Failed to schedule post');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule for {date.toLocaleDateString()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 border border-border rounded-lg p-3 text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Scheduling is for planning only. You will need to manually copy and post captions at the scheduled time.
          </div>

          <div>
            <Label htmlFor="time" className="mb-2 block">
              Select Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-2 block">Select Platforms</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedPlatforms.includes(Platform.facebook)}
                  onCheckedChange={() => togglePlatform(Platform.facebook)}
                />
                <SiFacebook className="w-5 h-5" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedPlatforms.includes(Platform.instagram)}
                  onCheckedChange={() => togglePlatform(Platform.instagram)}
                />
                <SiInstagram className="w-5 h-5" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedPlatforms.includes(Platform.tiktok)}
                  onCheckedChange={() => togglePlatform(Platform.tiktok)}
                />
                <SiTiktok className="w-5 h-5" />
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || isGenerating}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : captions ? (
              'Schedule'
            ) : (
              'Generate & Schedule'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
