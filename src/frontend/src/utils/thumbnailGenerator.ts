/**
 * Generates a thumbnail image from a video file
 * @param file - The video file to generate a thumbnail from
 * @returns Promise<Uint8Array> - JPEG thumbnail as bytes
 */
export async function generateThumbnail(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create thumbnail blob'));
            return;
          }

          // Convert blob to Uint8Array
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            resolve(new Uint8Array(arrayBuffer));
          };
          reader.onerror = () => reject(new Error('Failed to read thumbnail blob'));
          reader.readAsArrayBuffer(blob);
        },
        'image/jpeg',
        0.85
      );
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail generation'));
    };

    // Load the video file
    video.src = URL.createObjectURL(file);
  });
}
