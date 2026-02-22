import { Caption, Workspace } from '../backend';

export async function generateCaptions(
  originalCaption: string,
  workspace: Workspace
): Promise<Caption> {
  // Simulate AI generation with a small delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const baseContent = originalCaption || 'Check out this amazing content!';

  // Travel workspace: Cinematic Travel Expert persona
  if (workspace === Workspace.travel) {
    // Facebook: Cinematic storytelling with insider tips
    const facebook = `Picture this: ${baseContent}

Let me show you what the guidebooks won't tell you. This is the kind of moment that makes you fall in love with travel all over again. The golden hour hits different here—trust me on this.

Save this for your next adventure. You'll thank me later. 🌍✨

What's your dream destination? Drop it in the comments—I might just have the perfect insider tip for you.

#TravelCinematography #HiddenGems #TravelExpert #WanderlustVibes #AuthenticTravel #TravelStorytelling`;

    // Instagram: Visual storytelling with sensory details
    const instagram = `${baseContent} 🎬

Here's what they don't show you in the brochures. The way the light dances across the water at dawn. The smell of fresh coffee mixing with sea salt. The sound of locals laughing in the market. This is travel—raw, real, unforgettable.

Tag your travel partner who needs to see this 👇

Pro tip: Get here at sunrise. The crowds haven't arrived yet, and you'll have this magic all to yourself.

#TravelCinematography #TravelExpert #HiddenGems #AuthenticTravel #TravelStorytelling #WanderlustVibes #ExploreMore #TravelDeeper #OffTheBeatenPath #TravelInsider #CinematicTravel #TravelGoals #BucketListTravel #TravelInspiration #AdventureAwaits`;

    // TikTok: Cinematic hooks with helpful energy
    const tiktok = `${baseContent} 🎥

This is exactly what you need to know before you go. No fluff, just the real deal from someone who's been there, done that, and wants you to have the best experience possible.

Follow for more insider travel tips that actually work 🌍✨

#travel #travelexpert #traveltips #hiddengems #cinematictravel #wanderlust #bucketlist #travelinsider #fyp #foryou #viral #trending #2026`;

    return {
      facebook,
      instagram,
      tiktok,
    };
  }

  // AI Learning workspace: Original generic style
  // Facebook: Conversational and engaging
  const facebook = `${baseContent}

What do you think? Drop a comment below and let me know your thoughts! 💬

Don't forget to like and share if you found this valuable. Your support means everything! 🙏

#ContentCreation #SocialMedia #DigitalMarketing`;

  // Instagram: Hashtag-heavy and visual
  const instagram = `${baseContent} ✨

Tag someone who needs to see this! 👇

#ContentCreator #SocialMediaMarketing #DigitalContent #CreativeContent #ContentStrategy #MarketingTips #SocialMediaTips #ContentMarketing #OnlineMarketing #DigitalStrategy #CreatorEconomy #ContentIsKing #MarketingStrategy #SocialMediaGrowth #ContentCreation`;

  // TikTok: Trend-focused and concise
  const tiktok = `${baseContent} 🔥

Follow for more tips! 🚀

#fyp #foryou #viral #trending #contentcreator #socialmedia #tips #tutorial #howto #lifehack #musthave #2026`;

  return {
    facebook,
    instagram,
    tiktok,
  };
}
