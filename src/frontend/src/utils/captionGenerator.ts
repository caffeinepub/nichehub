import { Caption } from '../backend';

export async function generateCaptions(originalCaption: string): Promise<Caption> {
  // Simulate AI generation with a small delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const baseContent = originalCaption || 'Check out this amazing content!';

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
