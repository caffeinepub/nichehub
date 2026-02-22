import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Workspace, Video, ScheduledPost, Caption, Platform, ExternalBlob } from '../backend';
import { toast } from 'sonner';

export function useVideos(workspace: Workspace) {
  const { actor, isFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos', workspace],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideosByWorkspace(workspace);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScheduledPosts(workspace: Workspace) {
  const { actor, isFetching } = useActor();

  return useQuery<ScheduledPost[]>({
    queryKey: ['scheduledPosts', workspace],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScheduledPosts(workspace);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspace,
      file,
      thumbnail,
      onProgress,
    }: {
      workspace: Workspace;
      file: Uint8Array;
      thumbnail: Uint8Array | null;
      onProgress: (progress: number) => void;
    }) => {
      console.log('[useUploadVideo] Mutation triggered with:', {
        workspace,
        fileSize: file.length,
        thumbnailSize: thumbnail?.length || 0,
        hasThumbnail: !!thumbnail,
        actorInitialized: !!actor
      });

      if (!actor) {
        console.error('[useUploadVideo] Actor not initialized');
        throw new Error('Actor not initialized');
      }

      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('[useUploadVideo] Generated video ID:', videoId);
      
      try {
        console.log('[useUploadVideo] Creating video ExternalBlob from bytes...');
        // Create video ExternalBlob
        const arrayBuffer = new ArrayBuffer(file.length);
        const fileBuffer = new Uint8Array(arrayBuffer);
        fileBuffer.set(file);
        const externalBlob = ExternalBlob.fromBytes(fileBuffer).withUploadProgress((percentage) => {
          console.log('[useUploadVideo] ExternalBlob upload progress:', percentage + '%');
          onProgress(percentage);
        });
        console.log('[useUploadVideo] Video ExternalBlob created successfully');

        // Create thumbnail ExternalBlob if available
        let thumbnailBlob: ExternalBlob | null = null;
        if (thumbnail) {
          console.log('[useUploadVideo] Creating thumbnail ExternalBlob from bytes...');
          const thumbArrayBuffer = new ArrayBuffer(thumbnail.length);
          const thumbBuffer = new Uint8Array(thumbArrayBuffer);
          thumbBuffer.set(thumbnail);
          thumbnailBlob = ExternalBlob.fromBytes(thumbBuffer);
          console.log('[useUploadVideo] Thumbnail ExternalBlob created successfully');
        } else {
          console.log('[useUploadVideo] No thumbnail provided, continuing without it');
        }

        console.log('[useUploadVideo] Calling actor.uploadVideo with:', {
          workspace,
          videoId,
          externalBlobType: typeof externalBlob,
          caption: '',
          thumbnailBlobType: thumbnailBlob ? typeof thumbnailBlob : 'null'
        });

        const result = await actor.uploadVideo(workspace, videoId, externalBlob, '', thumbnailBlob);
        console.log('[useUploadVideo] Upload successful, backend returned:', result);
        
        return videoId;
      } catch (error) {
        console.error('[useUploadVideo] Error during upload:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    },
    onSuccess: (videoId, variables) => {
      console.log('[useUploadVideo] onSuccess callback triggered:', {
        videoId,
        workspace: variables.workspace
      });
      queryClient.invalidateQueries({ queryKey: ['videos', variables.workspace] });
      console.log('[useUploadVideo] Query invalidation triggered for workspace:', variables.workspace);
      toast.success('Video uploaded successfully!');
    },
    onError: (error) => {
      console.error('[useUploadVideo] onError callback triggered:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name,
        errorStack: error instanceof Error ? error.stack : undefined
      });
      toast.error('Failed to upload video: ' + (error instanceof Error ? error.message : 'Unknown error'));
    },
  });
}

export function useSchedulePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      workspace,
      platforms,
      captions,
      scheduledTime,
    }: {
      videoId: string;
      workspace: Workspace;
      platforms: Platform[];
      captions: Caption;
      scheduledTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.schedulePost(videoId, workspace, platforms, captions, scheduledTime);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts', variables.workspace] });
    },
  });
}

export function useSaveItinerary() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      id,
      hook,
      days,
      cta,
      writingPrompt,
    }: {
      id: string;
      hook: string;
      days: string[];
      cta: string;
      writingPrompt: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveItinerary(id, hook, days, cta, writingPrompt);
    },
    onSuccess: () => {
      toast.success('Itinerary saved!');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Failed to save itinerary');
    },
  });
}
