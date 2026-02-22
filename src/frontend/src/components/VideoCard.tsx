import { Video } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VideoCardProps {
  video: Video;
  onRepurpose: () => void;
  draggable?: boolean;
}

export default function VideoCard({ video, onRepurpose, draggable = true }: VideoCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (video.thumbnail) {
      setThumbnailUrl(video.thumbnail.getDirectURL());
    }
    setVideoUrl(video.file.getDirectURL());
  }, [video]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) return;
    e.dataTransfer.setData('application/json', JSON.stringify({
      videoId: video.id,
      workspace: video.workspace,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card
      className="overflow-hidden cursor-move touch-manipulation"
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="relative aspect-video bg-muted">
        {draggable && (
          <div className="absolute top-2 left-2 z-10 bg-background/80 rounded p-1">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {video.caption || 'No caption'}
        </p>
        <Button
          onClick={onRepurpose}
          className="w-full gap-2"
          variant="secondary"
        >
          <Sparkles className="w-4 h-4" />
          Repurpose
        </Button>
      </CardContent>
    </Card>
  );
}
