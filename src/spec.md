# Specification

## Summary
**Goal:** Replace simulated social media posting with a realistic manual export workflow and add Internet Identity authentication.

**Planned changes:**
- Remove "Post Now" button and replace with "Copy Captions" button that copies formatted captions to clipboard
- Update scheduled posts to clarify scheduling is for planning only, with manual posting required
- Add "Copy Captions" action to calendar scheduled posts
- Remove socialPlatformPublisher utility and all simulated posting logic
- Implement Internet Identity login/logout flow in the header
- Require authentication for video uploads and content management
- Add help section explaining the manual export workflow

**User-visible outcome:** Users authenticate with Internet Identity, generate AI-optimized captions, copy them to clipboard in a formatted structure, and manually post to social media platforms. Scheduling helps with content planning, but posting remains manual.
