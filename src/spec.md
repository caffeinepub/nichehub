# Specification

## Summary
**Goal:** Fix the non-functional "Login to Upload" button in the Media Library so unauthenticated users can trigger the Internet Identity authentication flow.

**Planned changes:**
- Debug and fix the onClick handler for the "Login to Upload" button in the VideoUpload component
- Verify the useInternetIdentity hook is properly imported and the login function is correctly bound to the button
- Ensure error states are handled with toast notifications
- Test button functionality on mobile devices

**User-visible outcome:** Users can click the "Login to Upload" button to authenticate via Internet Identity and access the file upload interface.
