interface ItineraryScript {
  hook: string;
  days: string[];
  cta: string;
}

export async function generateItineraryScript(videoCaption: string): Promise<ItineraryScript> {
  // Simulate AI generation with a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Extract location hints from caption or use generic travel content
  const baseLocation = videoCaption || 'this destination';

  // Hook: 3-second visual text overlay - cinematic and impactful
  const hook = '✈️ Three days. One unforgettable journey. Your adventure starts now.';

  // Body: 3-day numbered itinerary with cinematic, expert travel writing
  const days = [
    'Morning: Touch down and feel the pulse of the city. Check into your boutique hotel, then wander the historic quarter—let the cobblestone streets guide you. Afternoon: Savor authentic local cuisine at a hidden gem only locals know. Evening: Catch the sunset from the iconic viewpoint. The golden hour here? Pure magic.',
    
    'Morning: Rise early for the market tour—colors, aromas, stories in every stall. Grab fresh pastries and coffee from a corner café. Afternoon: Dive into the cultural heart—museums, galleries, or that secret garden everyone whispers about. Evening: Join a guided food tour. Taste your way through the neighborhood, one unforgettable bite at a time.',
    
    'Morning: Adventure day. Hike to the hidden waterfall or explore the coastal cliffs—your choice, your pace. Afternoon: Relax at a local spa or beach. You have earned it. Evening: Farewell dinner at the rooftop restaurant. Toast to memories made and stories you will tell for years.',
  ];

  // CTA: Save for later prompt - helpful and engaging
  const cta = '💾 Save this itinerary now. Screenshot it. Bookmark it. Share it with your travel crew. Your next adventure is calling—are you ready to answer?';

  return {
    hook,
    days,
    cta,
  };
}
