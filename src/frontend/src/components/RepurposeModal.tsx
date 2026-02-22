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
import { Progress } from '@/components/ui/progress';
import { Loader2, Copy, Download } from 'lucide-react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { generateCaptions } from '../utils/captionGenerator';
import ScheduleButton from './ScheduleButton';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useWorkspace } from '../contexts/WorkspaceContext';
import TextOverlaySettings, { TextOverlayConfig } from './TextOverlaySettings';
import { useVideoProcessor } from '../hooks/useVideoProcessor';

interface RepurposeModalProps {
  video: Video;
  open: boolean;
  onClose: () => void;
}

export default function RepurposeModal({ video, open, onClose }: RepurposeModalProps) {
  const [captions, setCaptions] = useState<Caption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    Platform.facebook,
    Platform.instagram,
    Platform.tiktok,
  ]);
  const [exportPlatform, setExportPlatform] = useState<Platform>(Platform.instagram);
  const { isLoginSuccess } = useInternetIdentity();
  const { workspace } = useWorkspace();

  // Text overlay settings
  const [overlaySettings, setOverlaySettings] = useState<TextOverlayConfig>({
    font: 'Arial',
    color: '#FFFFFF',
    position: 'bottom',
  });

  // Video processor
  const { processVideo, isProcessing, progress } = useVideoProcessor();

  useEffect(() => {
    if (open && !captions) {
      handleGenerate();
    }
  }, [open]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateCaptions(
        customPrompt || video.caption || '',
        workspace
      );
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

  const handleExportWithCaptions = async () => {
    if (!captions) return;

    try {
      // Get the caption text for the selected platform
      const captionText = captions[exportPlatform];

      toast.info('Processing video with captions...');

      // Process the video
      const videoUrl = video.file.getDirectURL();
      const processedBlob = await processVideo(videoUrl, captionText, overlaySettings);

      // Create download link
      const url = URL.createObjectURL(processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.caption.substring(0, 30)}_${exportPlatform}_captioned.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Video exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export video with captions');
    }
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

            <div>
              <Label htmlFor="custom-prompt" className="text-base font-semibold mb-2 block">
                Custom Writing Prompt (optional)
              </Label>
              <Textarea
                id="custom-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., write about the best restaurants in Tokyo, create a caption about travel tips, etc."
                rows={3}
                className="resize-none"
              />
              <Button
                onClick={handleGenerate}
                variant="outline"
                size="sm"
                className="mt-2 gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Loader2 className="w-4 h-4" />
                )}
                Regenerate with Prompt
              </Button>
            </div>

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

            {/* Text Overlay Settings */}
            <div className="border-t pt-6">
              <TextOverlaySettings settings={overlaySettings} onChange={setOverlaySettings} />
            </div>

            {/* Platform Selection for Export */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Platform Caption to Burn:</Label>
              <RadioGroup
                value={exportPlatform}
                onValueChange={(value: Platform) => setExportPlatform(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Platform.facebook} id="export-facebook" />
                  <Label htmlFor="export-facebook" className="cursor-pointer font-normal flex items-center gap-2">
                    <SiFacebook className="w-4 h-4" />
                    Facebook
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Platform.instagram} id="export-instagram" />
                  <Label htmlFor="export-instagram" className="cursor-pointer font-normal flex items-center gap-2">
                    <SiInstagram className="w-4 h-4" />
                    Instagram
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Platform.tiktok} id="export-tiktok" />
                  <Label htmlFor="export-tiktok" className="cursor-pointer font-normal flex items-center gap-2">
                    <SiTiktok className="w-4 h-4" />
                    TikTok
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Export Button */}
            <div className="space-y-4">
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{progress.message}</span>
                    <span className="font-medium">{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                </div>
              )}
              <Button
                onClick={handleExportWithCaptions}
                disabled={isProcessing}
                className="w-full gap-2"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export with Captions
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This will download a new video with the {exportPlatform} caption burned into it
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
