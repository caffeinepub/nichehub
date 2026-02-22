import { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useVideos } from '../hooks/useQueries';
import { Video } from '../backend';
import { Loader2, Sparkles, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { generateItineraryScript } from '../utils/itineraryGenerator';
import TextOverlaySettings, { TextOverlayConfig } from './TextOverlaySettings';
import { useVideoProcessor } from '../hooks/useVideoProcessor';

interface GeneratedItinerary {
  hook: string;
  days: string[];
  cta: string;
}

export default function ScriptLab() {
  const { workspace } = useWorkspace();
  const { data: videos, isLoading } = useVideos(workspace);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Editable state
  const [editedHook, setEditedHook] = useState('');
  const [editedDays, setEditedDays] = useState<string[]>([]);
  const [editedCta, setEditedCta] = useState('');

  // Text overlay settings
  const [overlaySettings, setOverlaySettings] = useState<TextOverlayConfig>({
    font: 'Arial',
    color: '#FFFFFF',
    position: 'bottom',
  });

  // Video processor
  const { processVideo, isProcessing, progress } = useVideoProcessor();

  const handleGenerateScript = async () => {
    if (!selectedVideo) return;

    setIsGenerating(true);
    try {
      const itinerary = await generateItineraryScript(
        customPrompt || selectedVideo.caption
      );
      setGeneratedItinerary(itinerary);
      
      // Initialize editable state
      setEditedHook(itinerary.hook);
      setEditedDays([...itinerary.days]);
      setEditedCta(itinerary.cta);
      
      toast.success('Itinerary script generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate script');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = async () => {
    if (!generatedItinerary) return;

    const formattedScript = `Hook:\n${editedHook}\n\nBody:\n${editedDays.map((day, idx) => `Day ${idx + 1}: ${day}`).join('\n')}\n\nCTA:\n${editedCta}`;

    try {
      await navigator.clipboard.writeText(formattedScript);
      setCopied(true);
      toast.success('Script copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy script');
    }
  };

  const handleDayChange = (index: number, value: string) => {
    const newDays = [...editedDays];
    newDays[index] = value;
    setEditedDays(newDays);
  };

  const handleExportWithCaptions = async () => {
    if (!selectedVideo || !generatedItinerary) return;

    try {
      // Format the full script text (shortened for overlay)
      const fullScript = `${editedHook}`;

      toast.info('Processing video with captions...');

      // Process the video
      const videoUrl = selectedVideo.file.getDirectURL();
      const processedBlob = await processVideo(videoUrl, fullScript, overlaySettings);

      // Create download link
      const url = URL.createObjectURL(processedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedVideo.caption.substring(0, 30)}_captioned.webm`;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Script Lab</CardTitle>
          <CardDescription>
            Select a travel video and generate a cinematic itinerary script with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Selection Grid */}
          <div>
            <Label className="text-base mb-3 block">Select a Video</Label>
            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      selectedVideo?.id === video.id
                        ? 'border-primary ring-2 ring-primary/50'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail.getDirectURL()}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No preview</span>
                      </div>
                    )}
                    {selectedVideo?.id === video.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <p>No videos available. Upload a video in the Media Library first.</p>
              </div>
            )}
          </div>

          {/* Custom Prompt Input */}
          {selectedVideo && (
            <div>
              <Label htmlFor="script-prompt" className="text-base font-semibold mb-2 block">
                Custom Writing Prompt (optional)
              </Label>
              <Textarea
                id="script-prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., write a 3-day Tokyo itinerary focused on food, create a script about adventure activities, etc."
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateScript}
            disabled={!selectedVideo || isGenerating}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Itinerary Script
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Script Display */}
      {generatedItinerary && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Script</CardTitle>
                <Button
                  onClick={handleCopyScript}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Script
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Edit the script below and copy it for your video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hook Section */}
              <div>
                <Label htmlFor="hook" className="text-base font-semibold mb-2 block">
                  Hook (3-second overlay)
                </Label>
                <Textarea
                  id="hook"
                  value={editedHook}
                  onChange={(e) => setEditedHook(e.target.value)}
                  rows={2}
                  className="resize-none font-medium"
                />
              </div>

              {/* Days Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Body (3-Day Itinerary)
                </Label>
                <div className="space-y-4">
                  {editedDays.map((day, index) => (
                    <div key={index}>
                      <Label htmlFor={`day-${index}`} className="mb-2 block">
                        Day {index + 1}
                      </Label>
                      <Textarea
                        id={`day-${index}`}
                        value={day}
                        onChange={(e) => handleDayChange(index, e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div>
                <Label htmlFor="cta" className="text-base font-semibold mb-2 block">
                  CTA (Call to Action)
                </Label>
                <Textarea
                  id="cta"
                  value={editedCta}
                  onChange={(e) => setEditedCta(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Text Overlay Settings */}
          <TextOverlaySettings settings={overlaySettings} onChange={setOverlaySettings} />

          {/* Export Button */}
          <Card>
            <CardContent className="pt-6">
              {isProcessing && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{progress.message}</span>
                    <span className="font-medium">{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                </div>
              )}
              <Button
                onClick={handleExportWithCaptions}
                disabled={!selectedVideo || isProcessing}
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
              <p className="text-xs text-muted-foreground text-center mt-2">
                This will download a new video with your hook text burned into it
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
