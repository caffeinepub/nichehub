# Specification

## Summary
**Goal:** Fix the "Login to Upload" button error that appears when authenticated users try to upload videos.

**Planned changes:**
- Update VideoUpload component to properly check authentication state before showing login button
- Hide or disable the "Login to Upload" button when user is already authenticated
- Remove duplicate login invocation logic causing "user already authenticated" error
- Ensure upload controls are directly accessible to authenticated users

**User-visible outcome:** Authenticated users can access the video upload interface directly without encountering a "login failed user already authenticated" error when clicking the upload button.
