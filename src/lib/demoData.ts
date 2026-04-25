// Demo data for showcase mode. No backend calls, no DB writes.
// Used to let recruiters and curious visitors experience the full app
// without needing a Spotify account or sign-up.

export const DEMO_TASTE_PROFILE = {
  confidence_score: 0.87,
  topics: [
    "Long-form interviews",
    "Tech & startups",
    "Behavioral science",
    "Investing",
    "Philosophy",
    "AI & machine learning",
    "Health optimization",
    "Founder stories",
  ],
  preferred_formats: ["Interview", "Solo deep-dive", "Conversational"],
  preferred_length: "60 to 120 minutes. You favor substantive deep-dives over short news updates.",
  key_interests: [
    "First-principles thinking",
    "Operator playbooks",
    "Mental models",
    "Frontier research",
    "Decision-making",
    "Compounding",
  ],
};

export const DEMO_RECOMMENDATIONS = [
  {
    id: "demo-1",
    episode_name: "How to Build Conviction in Uncertain Markets",
    show_name: "Invest Like the Best",
    episode_description:
      "Patrick O'Shaughnessy sits down with a top allocator to unpack how the best investors maintain high-conviction positions when the world feels chaotic.",
    reason:
      "You finished 9 of the last 10 Invest Like the Best episodes and consistently rate long-form interviews on decision-making at the top of your feed.",
    is_new_show: false,
    score: 0.94,
    image_url: null,
    episode_id: "demo-1",
    external_url: null,
  },
  {
    id: "demo-2",
    episode_name: "The Science of Sleep, Recovery, and Compounding Energy",
    show_name: "Huberman Lab",
    episode_description:
      "Andrew Huberman breaks down the latest research on sleep architecture and the small daily habits that compound into lasting energy gains.",
    reason:
      "Your taste profile shows a strong preference for science-backed health content. This episode pairs your interest in compounding with optimization.",
    is_new_show: false,
    score: 0.91,
    image_url: null,
    episode_id: "demo-2",
    external_url: null,
  },
  {
    id: "demo-3",
    episode_name: "Inside Anthropic: Building AI You Can Actually Trust",
    show_name: "Dwarkesh Podcast",
    episode_description:
      "A rare unscripted conversation with researchers at the frontier of AI alignment, covering interpretability, safety, and what comes after Claude.",
    reason:
      "You've been gravitating toward AI deep-dives and finishing them at a 96% rate. Dwarkesh's interview style matches your love of long-form technical conversations.",
    is_new_show: true,
    score: 0.89,
    image_url: null,
    episode_id: "demo-3",
    external_url: null,
  },
  {
    id: "demo-4",
    episode_name: "Naval on Wealth, Happiness, and the Art of Doing Less",
    show_name: "The Knowledge Project",
    episode_description:
      "Shane Parrish and Naval Ravikant return for a wide-ranging conversation on building leverage, finding peace, and why most ambition is misallocated.",
    reason:
      "Naval episodes consistently rank in your top 5% completion rate. Shane Parrish's interview format aligns with your preferred conversational style.",
    is_new_show: false,
    score: 0.88,
    image_url: null,
    episode_id: "demo-4",
    external_url: null,
  },
  {
    id: "demo-5",
    episode_name: "How Stripe Scaled From 2 Founders to a Global Backbone",
    show_name: "Acquired",
    episode_description:
      "Ben and David trace the full Stripe story, from the Collison brothers' first product to powering a meaningful slice of internet commerce.",
    reason:
      "Founder stories and operator playbooks dominate your listening history. Acquired's research-heavy format is a near-perfect match for your taste DNA.",
    is_new_show: false,
    score: 0.92,
    image_url: null,
    episode_id: "demo-5",
    external_url: null,
  },
  {
    id: "demo-6",
    episode_name: "The Quiet Power of First-Principles Thinking",
    show_name: "Lenny's Podcast",
    episode_description:
      "Lenny Rachitsky talks with a veteran product leader about reasoning from the ground up when frameworks fail and your team needs clarity.",
    reason:
      "Your key interests include first-principles thinking and decision-making. This episode lands directly in your sweet spot.",
    is_new_show: true,
    score: 0.86,
    image_url: null,
    episode_id: "demo-6",
    external_url: null,
  },
];
