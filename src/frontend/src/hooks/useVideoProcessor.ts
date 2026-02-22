import { useState, useCallback } from 'react';
import { videoProcessor, TextOverlaySettings, ProcessingProgress } from '../utils/videoProcessor';

export function useVideoProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({ percentage: 0, message: '' });
  const [error, setError] = useState<string | null>(null);

  const processVideo = useCallback(
    async (
      videoUrl: string,
      text: string,
      settings: TextOverlaySettings
    ): Promise<Blob> => {
      setIsProcessing(true);
      setError(null);
      setProgress({ percentage: 0, message: 'Starting...' });

      try {
        const blob = await videoProcessor.processVideoWithText(
          videoUrl,
          text,
          settings,
          (prog) => {
            setProgress(prog);
          }
        );

        return blob;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process video';
        setError(message);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    processVideo,
    isProcessing,
    progress,
    error,
  };
}
