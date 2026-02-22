import { Video } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface VideoPlayerModalProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, open, onClose }: VideoPlayerModalProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (video) {
      setVideoUrl(video.file.getDirectURL());
    }
  }, [video]);

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{video.caption || 'Video Player'}</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-video bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
