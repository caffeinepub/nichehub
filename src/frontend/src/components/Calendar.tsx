import { useState, useMemo } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useScheduledPosts, useVideos } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ScheduledPostItem from './ScheduledPostItem';
import TimePickerModal from './TimePickerModal';
import { Video } from '../backend';

export default function Calendar() {
  const { workspace } = useWorkspace();
  const { data: scheduledPosts, isLoading } = useScheduledPosts(workspace);
  const { data: videos } = useVideos(workspace);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ date: Date; videoId: string; workspace: string } | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentDate]);

  const getPostsForDate = (date: Date | null) => {
    if (!date || !scheduledPosts) return [];
    return scheduledPosts.filter((post) => {
      const postDate = new Date(Number(post.scheduledTime) / 1000000);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getVideoById = (videoId: string): Video | undefined => {
    return videos?.find((v) => v.id === videoId);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDraggedOver(dateKey);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, date: Date | null) => {
    e.preventDefault();
    setDraggedOver(null);

    if (!date) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      setDropTarget({ date, videoId: data.videoId, workspace: data.workspace });
    } catch (error) {
      console.error('Failed to parse drag data:', error);
    }
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{monthYear}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => {
          const dateKey = date ? date.toISOString() : `empty-${index}`;
          const posts = getPostsForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          const isDraggedOver = draggedOver === dateKey;

          return (
            <div
              key={dateKey}
              className={`min-h-24 p-2 border rounded-lg transition-colors ${
                date ? 'bg-card' : 'bg-muted/20'
              } ${isDraggedOver ? 'border-primary bg-primary/10' : 'border-border'} ${
                isToday ? 'ring-2 ring-primary' : ''
              }`}
              onDragOver={(e) => date && handleDragOver(e, dateKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, date)}
            >
              {date && (
                <>
                  <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                  <div className="space-y-1">
                    {posts.map((post) => {
                      const video = getVideoById(post.videoId);
                      return video ? (
                        <ScheduledPostItem key={post.videoId} post={post} video={video} />
                      ) : null;
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {dropTarget && (
        <TimePickerModal
          open={!!dropTarget}
          onClose={() => setDropTarget(null)}
          date={dropTarget.date}
          videoId={dropTarget.videoId}
          workspace={dropTarget.workspace}
        />
      )}
    </div>
  );
}
