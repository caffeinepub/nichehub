import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Copy, Calendar, Upload, Sparkles } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>How NicheHub Works</DialogTitle>
          <DialogDescription>
            Your AI-powered content planning assistant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">1. Upload Your Videos</h3>
                <p className="text-sm text-muted-foreground">
                  Upload videos to your Travel or AI Learning workspace
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">2. Generate AI Captions</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Repurpose" to generate platform-optimized captions for Facebook, Instagram, and TikTok
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">3. Schedule Your Posts</h3>
                <p className="text-sm text-muted-foreground">
                  Plan when to post by scheduling content on the calendar
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Copy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">4. Copy & Post Manually</h3>
                <p className="text-sm text-muted-foreground">
                  When it's time to post, copy the captions and paste them into each platform's native app
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> NicheHub helps you plan and prepare content, but you'll need to manually post to each social media platform at your scheduled times.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
