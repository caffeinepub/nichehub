interface ItineraryScript {
  hook: string;
  days: string[];
  cta: string;
}

export async function generateItineraryScript(
  contextPrompt: string
): Promise<ItineraryScript> {
  // Simulate AI generation with a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Extract location or theme hints from the prompt
  const baseContext = contextPrompt || 'this unforgettable destination';

  // Hook: 3-second visual text overlay - cinematic and attention-grabbing
  const hook = '✈️ Picture this: Three days that will change how you see travel forever. Ready?';

  // Body: 3-day numbered itinerary with cinematic Travel Expert persona
  const days = [
    'Morning: Imagine waking up to this—the city still sleepy, the streets yours alone. Check into your boutique hideaway, then let your feet guide you through the historic quarter. No map, no plan, just pure discovery. Afternoon: Here is what the locals know: that tiny restaurant tucked down the alley? That is where the magic happens. Order whatever the chef recommends—trust me on this. Evening: Golden hour from the viewpoint. Bring your camera, but also put it down for a moment. Some things you need to feel, not just capture. The way the light hits the architecture here? Pure cinema.',
    
    'Morning: Rise with the sun for the market tour. This is where you will taste the soul of the place—vibrant colors, intoxicating aromas, stories in every stall. Grab fresh pastries from that corner café where the barista knows everyone by name. Afternoon: Dive deep into the cultural heart. Museums, galleries, that secret garden everyone whispers about but few actually find. I will tell you exactly where to go. Evening: Food tour time. This is not your typical tourist trap—this is the real deal. Seven stops, countless flavors, and stories that will make you see this place through completely different eyes. You will thank me later.',
    
    'Morning: Adventure awaits. Whether it is the hidden waterfall hike or those dramatic coastal cliffs, this is your moment. Pack light, start early, and prepare to be absolutely blown away. Afternoon: Slow down. Hit that local spa or find your perfect beach spot. You have earned this. Let the experience sink in. Evening: Farewell dinner at the rooftop spot I have been saving for you. Toast to the memories you have made, the photos that do not do it justice, and the stories you will be telling for years. This is exactly what travel should feel like.',
  ];

  // CTA: Save for later prompt - enthusiastic and helpful
  const cta = '💾 Listen—save this right now. Screenshot it. Bookmark it. Send it to your travel crew. This is the itinerary you have been looking for. Your next adventure is calling, and trust me, you are going to want this roadmap. Ready to make it happen?';

  return {
    hook,
    days,
    cta,
  };
}
