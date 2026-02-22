import { ScheduledPost, Video, Platform } from '../backend';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScheduledPostItemProps {
  post: ScheduledPost;
  video: Video;
}

export default function ScheduledPostItem({ post, video }: ScheduledPostItemProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const postDate = new Date(Number(post.scheduledTime) / 1000000);
  const timeString = postDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    if (video.thumbnail) {
      setThumbnailUrl(video.thumbnail.getDirectURL());
    }
  }, [video]);

  const handleCopyCaptions = () => {
    const formattedText = `
📱 FACEBOOK
${post.captions.facebook}

📸 INSTAGRAM
${post.captions.instagram}

🎵 TIKTOK
${post.captions.tiktok}
    `.trim();

    navigator.clipboard.writeText(formattedText).then(() => {
      toast.success('Captions copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy captions');
    });
  };

  return (
    <div className="bg-accent/50 rounded p-2 text-xs group">
      <div className="flex items-center gap-2 mb-1">
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{timeString}</div>
          <div className="flex gap-1 mt-1">
            {post.platforms.includes(Platform.facebook) && <SiFacebook className="w-3 h-3" />}
            {post.platforms.includes(Platform.instagram) && <SiInstagram className="w-3 h-3" />}
            {post.platforms.includes(Platform.tiktok) && <SiTiktok className="w-3 h-3" />}
          </div>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-6 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopyCaptions}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy captions for manual posting</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
