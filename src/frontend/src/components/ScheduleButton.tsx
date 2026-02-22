import { useState } from 'react';
import { Video, Caption, Platform } from '../backend';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import DateTimePickerModal from './DateTimePickerModal';
import { useSchedulePost } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ScheduleButtonProps {
  video: Video;
  captions: Caption;
  platforms: Platform[];
  onScheduled?: () => void;
  disabled?: boolean;
}

export default function ScheduleButton({ video, captions, platforms, onScheduled, disabled }: ScheduleButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const { mutate: schedulePost, isPending } = useSchedulePost();

  const handleSchedule = (scheduledTime: Date) => {
    if (platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    schedulePost(
      {
        videoId: video.id,
        workspace: video.workspace,
        platforms,
        captions,
        scheduledTime: BigInt(scheduledTime.getTime() * 1000000),
      },
      {
        onSuccess: () => {
          toast.success('Post scheduled for planning! Remember to manually post at the scheduled time.');
          setShowPicker(false);
          onScheduled?.();
        },
        onError: () => {
          toast.error('Failed to schedule post');
        },
      }
    );
  };

  return (
    <>
      <Button
        onClick={() => setShowPicker(true)}
        disabled={isPending || platforms.length === 0 || disabled}
        variant="secondary"
        className="flex-1 gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Scheduling...
          </>
        ) : (
          <>
            <CalendarIcon className="w-4 h-4" />
            Schedule
          </>
        )}
      </Button>

      <DateTimePickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onConfirm={handleSchedule}
      />
    </>
  );
}
