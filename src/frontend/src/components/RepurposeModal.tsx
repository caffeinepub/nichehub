import { useState, useEffect } from 'react';
import { Video, Caption, Platform } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Calendar as CalendarIcon } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { generateCaptions } from '../utils/captionGenerator';
import ScheduleButton from './ScheduleButton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RepurposeModalProps {
  video: Video;
  open: boolean;
  onClose: () => void;
}

export default function RepurposeModal({ video, open, onClose }: RepurposeModalProps) {
  const [captions, setCaptions] = useState<Caption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.facebook,
    Platform.instagram,
    Platform.tiktok,
  ]);
  const { isLoginSuccess } = useInternetIdentity();

  useEffect(() => {
    if (open && !captions) {
      handleGenerate();
    }
  }, [open]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateCaptions(video.caption || '');
      setCaptions(generated);
    } catch (error) {
      console.error('Failed to generate captions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCaption = (platform: keyof Caption, value: string) => {
    if (captions) {
      setCaptions({ ...captions, [platform]: value });
    }
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleCopyCaptions = () => {
    if (!captions) return;

    const formattedText = `
📱 FACEBOOK
${captions.facebook}

📸 INSTAGRAM
${captions.instagram}

🎵 TIKTOK
${captions.tiktok}
    `.trim();

    navigator.clipboard.writeText(formattedText).then(() => {
      toast.success('Captions copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy captions');
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Repurpose Content</DialogTitle>
          <DialogDescription>
            AI-generated captions optimized for each platform
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : captions ? (
          <div className="space-y-6">
            {!isLoginSuccess && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
                Please log in to schedule posts
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-base font-semibold">Select Platforms:</Label>
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

            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <SiFacebook className="w-4 h-4" />
                  Facebook
                </Label>
                <Textarea
                  value={captions.facebook}
                  onChange={(e) => updateCaption('facebook', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {captions.facebook.length} characters
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <SiInstagram className="w-4 h-4" />
                  Instagram
                </Label>
                <Textarea
                  value={captions.instagram}
                  onChange={(e) => updateCaption('instagram', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {captions.instagram.length} characters
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <SiTiktok className="w-4 h-4" />
                  TikTok
                </Label>
                <Textarea
                  value={captions.tiktok}
                  onChange={(e) => updateCaption('tiktok', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {captions.tiktok.length} characters
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCopyCaptions}
                variant="outline"
                className="flex-1 gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Captions
              </Button>
              <ScheduleButton
                video={video}
                captions={captions}
                platforms={selectedPlatforms}
                onScheduled={onClose}
                disabled={!isLoginSuccess}
              />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
