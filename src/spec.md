# Specification

## Summary
**Goal:** Debug and fix the video upload functionality in NicheHub to enable users to successfully upload videos to their workspaces.

**Planned changes:**
- Debug the VideoUpload component's file upload flow to ensure file input binding, handleFileSelect function invocation, and uploadVideo mutation triggering work correctly
- Debug the backend video upload endpoint in main.mo to verify proper receipt and storage of video blobs with metadata (caption, thumbnail, workspace)
- Verify that the useQueries hook's uploadVideo mutation properly handles upload progress tracking, error states, and success callbacks
- Add comprehensive error logging to both frontend (VideoUpload component and useQueries hook) and backend (main.mo uploadVideo function) to capture detailed error information

**User-visible outcome:** Users can successfully upload videos with thumbnails to their workspaces, see upload progress, receive clear error messages if uploads fail, and view newly uploaded videos in their media library.
