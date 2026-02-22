import { useState, useRef } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useUploadVideo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { generateThumbnail } from '../utils/thumbnailGenerator';

export default function VideoUpload() {
  const { workspace } = useWorkspace();
  const { mutate: uploadVideo, isPending } = useUploadVideo();
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoginSuccess } = useInternetIdentity();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    try {
      // Generate thumbnail
      let thumbnailBytes: Uint8Array | null = null;
      try {
        thumbnailBytes = await generateThumbnail(file);
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error);
        // Continue without thumbnail
      }

      // Read video file
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      uploadVideo({
        workspace,
        file: bytes,
        thumbnail: thumbnailBytes,
        onProgress: setUploadProgress,
      });
    } catch (error) {
      toast.error('Failed to upload video');
      console.error(error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!isLoginSuccess) {
      toast.error('Please log in to upload videos');
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isPending || !isLoginSuccess}
        />
        
        <Button
          onClick={handleClick}
          disabled={isPending || !isLoginSuccess}
          className="w-full h-24 text-lg"
          size="lg"
        >
          {!isLoginSuccess ? (
            <>
              <Lock className="w-6 h-6 mr-2" />
              Login to Upload
            </>
          ) : isPending ? (
            <>
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 mr-2" />
              Upload Video
            </>
          )}
        </Button>

        {isPending && uploadProgress > 0 && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              {uploadProgress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
