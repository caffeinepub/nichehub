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
      if (!actor) throw new Error('Actor not initialized');

      const videoId = `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create video ExternalBlob
      const arrayBuffer = new ArrayBuffer(file.length);
      const fileBuffer = new Uint8Array(arrayBuffer);
      fileBuffer.set(file);
      const externalBlob = ExternalBlob.fromBytes(fileBuffer).withUploadProgress(onProgress);

      // Create thumbnail ExternalBlob if available
      let thumbnailBlob: ExternalBlob | null = null;
      if (thumbnail) {
        const thumbArrayBuffer = new ArrayBuffer(thumbnail.length);
        const thumbBuffer = new Uint8Array(thumbArrayBuffer);
        thumbBuffer.set(thumbnail);
        thumbnailBlob = ExternalBlob.fromBytes(thumbBuffer);
      }

      await actor.uploadVideo(workspace, videoId, externalBlob, '', thumbnailBlob);
      return videoId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['videos', variables.workspace] });
      toast.success('Video uploaded successfully!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
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
    }: {
      id: string;
      hook: string;
      days: string[];
      cta: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.saveItinerary(id, hook, days, cta);
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
