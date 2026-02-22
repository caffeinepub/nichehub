/**
 * Generates a thumbnail image from a video file
 * @param file - The video file to generate a thumbnail from
 * @returns Promise<Uint8Array> - JPEG thumbnail as bytes
 */
export async function generateThumbnail(file: File): Promise<Uint8Array> {
  console.log('[thumbnailGenerator] Starting thumbnail generation for file:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('[thumbnailGenerator] Failed to get canvas 2D context');
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      console.log('[thumbnailGenerator] Video metadata loaded:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      });
      
      // Seek to 1 second or 10% of video duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      console.log('[thumbnailGenerator] Seeking to time:', seekTime);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      console.log('[thumbnailGenerator] Video seeked successfully, drawing to canvas');
      
      try {
        // Set canvas dimensions to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('[thumbnailGenerator] Canvas dimensions set:', {
          width: canvas.width,
          height: canvas.height
        });

        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('[thumbnailGenerator] Video frame drawn to canvas');

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('[thumbnailGenerator] Failed to create blob from canvas');
              reject(new Error('Failed to create thumbnail blob'));
              return;
            }

            console.log('[thumbnailGenerator] Blob created:', {
              size: blob.size,
              type: blob.type
            });

            // Convert blob to Uint8Array
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              const uint8Array = new Uint8Array(arrayBuffer);
              console.log('[thumbnailGenerator] Thumbnail conversion complete:', {
                bytesLength: uint8Array.length,
                sizeInKB: (uint8Array.length / 1024).toFixed(2) + ' KB'
              });
              resolve(uint8Array);
            };
            reader.onerror = () => {
              console.error('[thumbnailGenerator] FileReader error:', reader.error);
              reject(new Error('Failed to read thumbnail blob'));
            };
            reader.readAsArrayBuffer(blob);
          },
          'image/jpeg',
          0.85
        );
      } catch (error) {
        console.error('[thumbnailGenerator] Error during canvas operations:', error);
        reject(error);
      }
    };

    video.onerror = (e) => {
      console.error('[thumbnailGenerator] Video loading error:', {
        error: e,
        videoError: video.error,
        videoErrorCode: video.error?.code,
        videoErrorMessage: video.error?.message
      });
      reject(new Error('Failed to load video for thumbnail generation'));
    };

    // Load the video file
    try {
      const objectURL = URL.createObjectURL(file);
      console.log('[thumbnailGenerator] Created object URL, loading video...');
      video.src = objectURL;
    } catch (error) {
      console.error('[thumbnailGenerator] Error creating object URL:', error);
      reject(error);
    }
  });
}
