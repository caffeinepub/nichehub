import { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useVideos, useUploadVideo } from '../hooks/useQueries';
import VideoUpload from './VideoUpload';
import VideoCard from './VideoCard';
import RepurposeModal from './RepurposeModal';
import { Video } from '../backend';
import { Loader2 } from 'lucide-react';

export default function MediaLibrary() {
  const { workspace } = useWorkspace();
  const { data: videos, isLoading } = useVideos(workspace);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VideoUpload />

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onRepurpose={() => setSelectedVideo(video)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No videos uploaded yet. Upload your first video to get started!</p>
        </div>
      )}

      {selectedVideo && (
        <RepurposeModal
          video={selectedVideo}
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
