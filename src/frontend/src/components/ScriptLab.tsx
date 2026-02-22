import { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useVideos } from '../hooks/useQueries';
import { Video } from '../backend';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { generateItineraryScript } from '../utils/itineraryGenerator';

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

  // Editable state
  const [editedHook, setEditedHook] = useState('');
  const [editedDays, setEditedDays] = useState<string[]>([]);
  const [editedCta, setEditedCta] = useState('');

  const handleGenerateScript = async () => {
    if (!selectedVideo) return;

    setIsGenerating(true);
    try {
      const itinerary = await generateItineraryScript(selectedVideo.caption);
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

          {/* Generate Button */}
          <Button
            onClick={handleGenerateScript}
            disabled={!selectedVideo || isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Itinerary Script
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Script Display */}
      {generatedItinerary && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Itinerary Script</CardTitle>
            <CardDescription>
              Edit any section below to refine your script
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hook Section */}
            <div className="space-y-2">
              <Label htmlFor="hook" className="text-base font-semibold">
                Hook <span className="text-xs text-muted-foreground font-normal">(3-second visual overlay)</span>
              </Label>
              <Textarea
                id="hook"
                value={editedHook}
                onChange={(e) => setEditedHook(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="Enter hook text..."
              />
            </div>

            {/* Body Section - 3 Days */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Body <span className="text-xs text-muted-foreground font-normal">(3-day itinerary)</span>
              </Label>
              {editedDays.map((day, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`day-${index}`} className="text-sm">
                    Day {index + 1}
                  </Label>
                  <Textarea
                    id={`day-${index}`}
                    value={day}
                    onChange={(e) => handleDayChange(index, e.target.value)}
                    className="min-h-[100px] resize-none"
                    placeholder={`Enter Day ${index + 1} itinerary...`}
                  />
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-2">
              <Label htmlFor="cta" className="text-base font-semibold">
                CTA <span className="text-xs text-muted-foreground font-normal">(Save for later prompt)</span>
              </Label>
              <Textarea
                id="cta"
                value={editedCta}
                onChange={(e) => setEditedCta(e.target.value)}
                className="min-h-[80px] resize-none"
                placeholder="Enter call-to-action..."
              />
            </div>

            {/* Copy Button */}
            <Button
              onClick={handleCopyScript}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
