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
  const { identity, login, isLoggingIn } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[VideoUpload] File input onChange fired');
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('[VideoUpload] No file selected');
      return;
    }

    console.log('[VideoUpload] File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    });

    if (!file.type.startsWith('video/')) {
      console.error('[VideoUpload] Invalid file type:', file.type);
      toast.error('Please select a valid video file');
      return;
    }

    try {
      console.log('[VideoUpload] Starting thumbnail generation...');
      // Generate thumbnail
      let thumbnailBytes: Uint8Array | null = null;
      try {
        thumbnailBytes = await generateThumbnail(file);
        console.log('[VideoUpload] Thumbnail generated successfully:', {
          size: thumbnailBytes.length,
          sizeInKB: (thumbnailBytes.length / 1024).toFixed(2) + ' KB'
        });
      } catch (error) {
        console.warn('[VideoUpload] Failed to generate thumbnail:', error);
        toast.warning('Continuing without thumbnail');
        // Continue without thumbnail
      }

      console.log('[VideoUpload] Reading video file as ArrayBuffer...');
      // Read video file
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      console.log('[VideoUpload] Video file read successfully:', {
        bytesLength: bytes.length,
        sizeInMB: (bytes.length / (1024 * 1024)).toFixed(2) + ' MB'
      });

      console.log('[VideoUpload] Calling uploadVideo mutation with:', {
        workspace,
        fileSize: bytes.length,
        thumbnailSize: thumbnailBytes?.length || 0,
        hasThumbnail: !!thumbnailBytes
      });

      uploadVideo({
        workspace,
        file: bytes,
        thumbnail: thumbnailBytes,
        onProgress: (progress) => {
          console.log('[VideoUpload] Upload progress:', progress + '%');
          setUploadProgress(progress);
        },
      });
    } catch (error) {
      console.error('[VideoUpload] Error during file processing:', error);
      toast.error('Failed to upload video: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      console.log('[VideoUpload] File input cleared');
    }
  };

  const handleClick = async () => {
    console.log('[VideoUpload] Upload button clicked, isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('[VideoUpload] User not logged in, initiating login...');
      try {
        await login();
        console.log('[VideoUpload] Login successful');
      } catch (error) {
        console.error('[VideoUpload] Login error:', error);
        toast.error('Failed to log in. Please try again.');
      }
      return;
    }
    
    console.log('[VideoUpload] Triggering file input click');
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
          disabled={isPending || !isAuthenticated}
        />
        
        <Button
          onClick={handleClick}
          disabled={isPending || isLoggingIn}
          className="w-full h-24 text-lg"
          size="lg"
        >
          {!isAuthenticated ? (
            isLoggingIn ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 mr-2" />
                Login to Upload
              </>
            )
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
