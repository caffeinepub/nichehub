# Specification

## Summary
**Goal:** Add video text overlay engine with customizable captions and export functionality to burn AI-generated scripts and captions directly onto videos.

**Planned changes:**
- Integrate ffmpeg.wasm or HTML5 Canvas overlay system in the frontend for video processing
- Add text overlay customization controls (Font, Color, Position) in ScriptLab after itinerary script generation
- Add text overlay customization controls (Font, Color, Position) in RepurposeModal after AI caption generation
- Add "Export with Captions" button in ScriptLab to render and download video with burned-in itinerary script
- Add "Export with Captions" button in RepurposeModal to render and download video with burned-in platform-specific captions (Facebook, Instagram, or TikTok)
- Display processing progress with loading indicators
- Show success and error states via toast notifications

**User-visible outcome:** Users can customize text overlay appearance (font, color, position) for both itinerary scripts and social media captions, then export high-quality MP4 videos with captions permanently burned in, ready for direct posting to social media from mobile devices.
