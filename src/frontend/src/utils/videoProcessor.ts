export interface TextOverlaySettings {
  font: string;
  color: string;
  position: 'top' | 'center' | 'bottom';
}

export interface ProcessingProgress {
  percentage: number;
  message: string;
}

class VideoProcessor {
  async processVideoWithText(
    videoUrl: string,
    text: string,
    settings: TextOverlaySettings,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        onProgress?.({ percentage: 0, message: 'Loading video...' });

        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;
        video.muted = true;

        video.addEventListener('loadedmetadata', async () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            onProgress?.({ percentage: 10, message: 'Preparing canvas...' });

            // Calculate text position
            const fontSize = Math.floor(canvas.height / 15);
            ctx.font = `bold ${fontSize}px ${settings.font}`;
            ctx.fillStyle = settings.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            const yPosition = this.getYPosition(settings.position, canvas.height, fontSize);

            // Split text into lines if too long
            const maxWidth = canvas.width * 0.9;
            const lines = this.wrapText(ctx, text, maxWidth);

            onProgress?.({ percentage: 20, message: 'Processing frames...' });

            // Set up MediaRecorder
            const stream = canvas.captureStream(30);
            
            // Get audio from original video
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(video);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.connect(audioContext.destination);

            // Combine video and audio streams
            const audioTrack = destination.stream.getAudioTracks()[0];
            if (audioTrack) {
              stream.addTrack(audioTrack);
            }

            const chunks: Blob[] = [];
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm;codecs=vp9',
              videoBitsPerSecond: 5000000,
            });

            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                chunks.push(e.data);
              }
            };

            mediaRecorder.onstop = () => {
              onProgress?.({ percentage: 100, message: 'Complete!' });
              const blob = new Blob(chunks, { type: 'video/webm' });
              resolve(blob);
            };

            mediaRecorder.onerror = (e) => {
              reject(new Error('MediaRecorder error'));
            };

            // Start recording
            mediaRecorder.start();
            video.play();

            let lastProgress = 20;

            // Render loop
            const renderFrame = () => {
              if (video.paused || video.ended) {
                mediaRecorder.stop();
                audioContext.close();
                return;
              }

              // Draw video frame
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Draw text overlay
              ctx.font = `bold ${fontSize}px ${settings.font}`;
              ctx.fillStyle = settings.color;
              ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
              ctx.shadowBlur = 10;

              lines.forEach((line, index) => {
                const lineY = yPosition + (index * fontSize * 1.2);
                ctx.fillText(line, canvas.width / 2, lineY);
              });

              // Update progress
              const progress = Math.min(90, 20 + (video.currentTime / video.duration) * 70);
              if (progress - lastProgress > 5) {
                lastProgress = progress;
                onProgress?.({ 
                  percentage: Math.round(progress), 
                  message: `Processing: ${Math.round(progress)}%` 
                });
              }

              requestAnimationFrame(renderFrame);
            };

            renderFrame();

          } catch (error) {
            reject(error);
          }
        });

        video.addEventListener('error', () => {
          reject(new Error('Failed to load video'));
        });

        video.load();

      } catch (error) {
        reject(error);
      }
    });
  }

  private getYPosition(position: 'top' | 'center' | 'bottom', height: number, fontSize: number): number {
    switch (position) {
      case 'top':
        return fontSize * 2;
      case 'center':
        return height / 2;
      case 'bottom':
        return height - fontSize * 2;
      default:
        return height / 2;
    }
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    // Limit to 3 lines
    return lines.slice(0, 3);
  }
}

// Singleton instance
export const videoProcessor = new VideoProcessor();
