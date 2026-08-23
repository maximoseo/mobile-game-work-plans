export interface Milestone {
  name: string;
  tasks: string[];
  duration: string;
  dependencies?: string;
}

export interface GamePlan {
  id: string;
  title: string;
  genre: string;
  coreGameplay: string;
  features: string[];
  audience: string;
  monetization: string;
  workPlan: Milestone[];
}

export interface PriorityItem {
  rank: number;
  title: string;
  why: string;
}

export const priorityList: PriorityItem[] = [
  { rank: 1, title: "One-Tap Time Heist", why: "Easy to understand, fits short mobile sessions, near-infinite puzzle depth." },
  { rank: 2, title: "Lost Signal", why: "Narrative format sustains engagement through messages, clues, photos, and reveals." },
  { rank: 3, title: "Monster Hotel", why: "Combines decorating, management, humor, and collection for long-term progression." },
  { rank: 4, title: "Reverse Tower Defense", why: "Inverted gameplay stands out from the genre and rewards strategic experimentation." },
];

export const firstProject = {
  title: "One-Tap Time Heist",
  genre: "Puzzle, strategy, adventure",
  coreGameplay:
    "The player controls a thief who must complete a heist in a limited number of moves. Once per level, the player can rewind time to undo mistakes and try a new strategy.",
  features: [
    "One-tap movement and interaction",
    "Time rewind mechanic (once per level)",
    "Guard patrol patterns",
    "Security cameras and traps",
    "Collectible treasures",
    "Increasingly complex levels",
    "Unlockable thief costumes and tools",
    "Short levels designed for mobile play",
    "Daily challenge levels",
    "Leaderboards based on moves and completion time",
  ],
  audience: "Casual mobile players, puzzle fans, and people who enjoy short strategic gameplay sessions.",
  monetization: [
    "Cosmetic outfits",
    "Optional hint packages",
    "Rewarded ads for an extra rewind",
    "Premium version without advertisements",
    "Special challenge level packs",
  ],
};

export const gamePlans: GamePlan[] = [
  {
    id: "pocket-planet-keeper",
    title: "Pocket Planet Keeper",
    genre: "Simulation / god-game",
    coreGameplay:
      "Grow a tiny planet by balancing nature, cities, weather, and population. Every choice permanently changes the world, creating a persistent, evolving ecosystem.",
    features: [
      "Four interlocking systems: nature, cities, weather, population",
      "Permanent, non-reversible world state",
      "Procedural planet generation with unique biomes",
      "Weather events that cascade into other systems",
      "Population happiness and migration dynamics",
      "Photo-mode snapshots of planet evolution",
    ],
    audience: "Casual sim fans and players who enjoy long-term, consequence-driven world building.",
    monetization: "Premium unlock for extra planets; cosmetic planet skins; optional speed-up boosts.",
    workPlan: [
      { name: "Concept", tasks: ["Define system-balance loop", "Paper-prototype the four systems", "Write design doc"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype core balance loop", "Art style exploration", "Tech spike on save/load of world state"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build nature/city/weather/population systems", "Implement permanent-state persistence", "Create biomes + planet art", "Add weather cascade events"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Balance testing across systems", "Save/load regression tests", "Performance on low-end devices"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch in 2 regions", "Analytics + crash monitoring"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["Content updates (new biomes/events)", "Community-driven balance patches", "Seasonal events"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "one-tap-time-heist",
    title: "One-Tap Time Heist",
    genre: "Puzzle / strategy / adventure",
    coreGameplay:
      "Control a thief completing a heist in a limited number of moves. Once per level, rewind time to undo mistakes and try a new strategy.",
    features: [
      "One-tap movement and interaction",
      "Time rewind mechanic (once per level)",
      "Guard patrol patterns",
      "Security cameras and traps",
      "Collectible treasures",
      "Unlockable thief costumes and tools",
      "Daily challenge levels",
      "Leaderboards by moves and completion time",
    ],
    audience: "Casual mobile players, puzzle fans, and people who enjoy short strategic sessions.",
    monetization: "Cosmetic outfits; hint packages; rewarded ads for extra rewind; ad-free premium; challenge packs.",
    workPlan: [
      { name: "Concept", tasks: ["Define move-count economy", "Design rewind rule (once per level)", "Map 20 starter levels"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype one-tap + rewind loop", "Guard AI spike", "Level-editor spike"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build tap/rewind core", "Implement guard patrols, cameras, traps", "Create 60+ levels", "Add costumes/tools + leaderboards"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Level difficulty curve testing", "Rewind edge-case tests", "Leaderboard integrity checks"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Daily challenge pipeline", "Soft launch"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["Weekly challenge levels", "New tools/costumes", "Leaderboard seasons"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "ghost-train-tycoon",
    title: "Ghost Train Tycoon",
    genre: "Tycoon / management",
    coreGameplay:
      "Build and manage a supernatural railway. Transport ghosts, upgrade haunted stations, and avoid angry spirits that disrupt service.",
    features: [
      "Railway network building and routing",
      "Ghost passengers with unique needs",
      "Haunted station upgrades",
      "Angry-spirit random events",
      "Economy of ectoplasm currency",
      "Expanding map regions",
    ],
    audience: "Tycoon/management fans who enjoy quirky themes and incremental progression.",
    monetization: "Premium currency for cosmetics; ad-free IAP; optional time-skip boosts.",
    workPlan: [
      { name: "Concept", tasks: ["Define railway economy", "Design ghost passenger types", "Map progression structure"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype routing loop", "Economy balance spike", "Art style (spooky-cute)"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build network routing", "Implement station upgrades", "Add ghost AI + spirit events", "Create regions + art"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Economy balance testing", "Routing pathfinding tests", "Event frequency tuning"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New regions + ghosts", "Seasonal haunted events", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "kitchen-chaos-delivery",
    title: "Kitchen Chaos Delivery",
    genre: "Arcade / time-management",
    coreGameplay:
      "Prepare meals while riding through unpredictable neighborhoods. Combine ingredients quickly and deliver orders before time runs out.",
    features: [
      "Ingredient-combination cooking mechanic",
      "Moving vehicle with dynamic obstacles",
      "Time-pressure order queue",
      "Unpredictable neighborhood hazards",
      "Combo and streak scoring",
      "Unlockable recipes and vehicles",
    ],
    audience: "Casual arcade players who enjoy fast, reflex-driven time-management games.",
    monetization: "Rewarded ads for retries; cosmetic vehicles; recipe packs.",
    workPlan: [
      { name: "Concept", tasks: ["Define cooking combo rules", "Design order queue pacing", "Map neighborhood hazard set"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype cook-while-moving loop", "Difficulty curve spike", "Art style"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build ingredient-combo system", "Implement moving-vehicle hazards", "Create levels + recipes", "Add scoring/streaks"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Pacing and difficulty tuning", "Input latency testing", "Device performance"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New recipes/vehicles", "Daily challenges", "Seasonal themes"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "tiny-mech-arena",
    title: "Tiny Mech Arena",
    genre: "Action / builder",
    coreGameplay:
      "Collect household objects and build miniature robots that battle inside bedrooms, kitchens, garages, and other small environments.",
    features: [
      "Part-collection from household objects",
      "Mech building and customization",
      "Arena battles in small environments",
      "Physics-based combat",
      "Part rarity and synergy system",
      "Local and online multiplayer",
    ],
    audience: "Action and builder fans who enjoy creative assembly and competitive battles.",
    monetization: "Battle pass; cosmetic mech parts; premium currency.",
    workPlan: [
      { name: "Concept", tasks: ["Define part system and synergies", "Design arena environments", "Combat balance spec"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype build-then-battle loop", "Physics combat spike", "Multiplayer netcode spike"], duration: "4 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build part-collection + builder", "Implement physics combat", "Create arenas + parts", "Add multiplayer"], duration: "14 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Combat balance testing", "Multiplayer stability", "Physics edge cases"], duration: "4 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Server capacity", "Soft launch"], duration: "3 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New parts + arenas", "Ranked seasons", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "swipe-knight",
    title: "Swipe Knight",
    genre: "Action roguelike",
    coreGameplay:
      "A simple action roguelike where swiping controls attacks, dodges, and movement. Learn enemy patterns and defeat increasingly difficult bosses.",
    features: [
      "Swipe-based attack/dodge/move controls",
      "Enemy pattern learning",
      "Boss fights with escalating difficulty",
      "Roguelike run structure with upgrades",
      "Unlockable weapons and abilities",
      "Procedural run variety",
    ],
    audience: "Roguelike and action fans who want deep combat with simple, mobile-friendly controls.",
    monetization: "Premium unlock; cosmetic skins; optional revive via rewarded ads.",
    workPlan: [
      { name: "Concept", tasks: ["Define swipe gesture map", "Design enemy pattern set", "Boss progression spec"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype swipe combat feel", "Enemy AI spike", "Run-structure spike"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build swipe controls", "Implement enemy patterns + bosses", "Create run upgrades + weapons", "Add procedural variety"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Combat feel tuning", "Boss difficulty testing", "Run balance"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New weapons/bosses", "Daily runs", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "lost-signal",
    title: "Lost Signal",
    genre: "Mystery / narrative",
    coreGameplay:
      "A mystery game told through text messages, radio signals, photos, and incoming calls. Players solve a disappearance by collecting clues.",
    features: [
      "Text-message and call narrative system",
      "Radio signal decoding puzzles",
      "Photo and clue collection",
      "Branching story with multiple endings",
      "Real-time style message pacing",
      "In-game phone interface",
    ],
    audience: "Narrative and mystery fans who enjoy immersive, story-driven experiences.",
    monetization: "Premium episodic unlock; ad-free; optional hint IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Write story outline + mystery", "Design clue web", "Map branching endings"], duration: "4 weeks" },
      { name: "Pre-production", tasks: ["Prototype message interface", "Signal-puzzle spike", "Script draft"], duration: "4 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build phone/message UI", "Implement signal puzzles", "Write full script + photos", "Add branching logic"], duration: "14 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Story continuity testing", "Puzzle solvability", "Branch coverage"], duration: "4 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Localization", "Soft launch"], duration: "3 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New episodes", "Alternate endings", "Community clue events"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "cloud-shepherd",
    title: "Cloud Shepherd",
    genre: "Casual / puzzle",
    coreGameplay:
      "Guide clouds across the sky to create rain, protect crops, and stop storms from damaging villages.",
    features: [
      "Cloud herding and pathing mechanic",
      "Rain creation to water crops",
      "Storm diversion gameplay",
      "Village protection objectives",
      "Weather-based puzzle levels",
      "Relaxing art and audio",
    ],
    audience: "Casual puzzle players who enjoy gentle, atmospheric, low-pressure gameplay.",
    monetization: "Premium unlock; cosmetic cloud skins; optional hint IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define cloud-herding mechanic", "Design weather puzzle set", "Map level progression"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype herding feel", "Storm-diversion spike", "Art style (soft/pastel)"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build cloud pathing", "Implement rain + storms", "Create puzzle levels", "Add village objectives"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Puzzle solvability", "Difficulty curve", "Performance"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New puzzle levels", "Seasonal weather", "Relaxation modes"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "monster-hotel",
    title: "Monster Hotel",
    genre: "Management / simulation",
    coreGameplay:
      "Run a hotel for monsters. Design rooms around each creature's needs, serve strange food, and manage difficult guests.",
    features: [
      "Room design per creature needs",
      "Strange-food cooking and serving",
      "Difficult-guest management",
      "Monster collection and unlockables",
      "Hotel expansion and upgrades",
      "Humor-driven narrative events",
    ],
    audience: "Management/sim fans who enjoy decorating, collection, and light humor.",
    monetization: "Premium currency; cosmetic room themes; ad-free IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define monster guest types", "Design room-need system", "Map hotel progression"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype room-design loop", "Guest-AI spike", "Art style (monster-cute)"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build room designer", "Implement guest needs + food", "Create monsters + rooms", "Add expansion + events"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Economy balance", "Guest-AI testing", "Room-design UX"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New monsters + rooms", "Seasonal events", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "reverse-tower-defense",
    title: "Reverse Tower Defense",
    genre: "Strategy / puzzle",
    coreGameplay:
      "Instead of defending a base, control waves of enemies and find the best path through defensive towers.",
    features: [
      "Enemy-wave command and routing",
      "Tower-defense map inversion",
      "Path-finding optimization",
      "Enemy unit types and abilities",
      "Procedural tower layouts",
      "Score based on survivors and efficiency",
    ],
    audience: "Strategy fans who want a fresh inversion of the tower-defense genre.",
    monetization: "Premium unlock; unit skins; optional hint IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define enemy-command model", "Design unit types", "Map difficulty curve"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype routing loop", "Tower-AI spike", "Pathfinding spike"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build enemy routing", "Implement tower defenses", "Create levels + units", "Add scoring"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Pathfinding correctness", "Difficulty tuning", "Scoring balance"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New units/towers", "Puzzle packs", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "street-food-empire",
    title: "Street Food Empire",
    genre: "Tycoon / simulation",
    coreGameplay:
      "Start with one food cart and expand into a worldwide restaurant business. Discover local recipes and compete with rival vendors.",
    features: [
      "Food-cart to restaurant progression",
      "Local recipe discovery",
      "Rival vendor competition",
      "Global city expansion",
      "Ingredient and supply economy",
      "Reputation and review system",
    ],
    audience: "Tycoon fans who enjoy incremental growth and geographic expansion.",
    monetization: "Premium currency; cosmetic carts; ad-free IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define expansion loop", "Design recipe-discovery system", "Map cities + rivals"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype cart-to-restaurant loop", "Economy spike", "Art style"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build cart management", "Implement recipes + cities", "Add rivals + reputation", "Create supply economy"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Economy balance", "Progression pacing", "Rival AI"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New cities + recipes", "Seasonal events", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "shadow-garden",
    title: "Shadow Garden",
    genre: "Puzzle / environmental",
    coreGameplay:
      "Grow plants only in areas touched by darkness. Move lamps, manipulate shadows, and solve environmental puzzles.",
    features: [
      "Shadow-based plant growth mechanic",
      "Lamp movement and shadow manipulation",
      "Environmental puzzle levels",
      "Light/shadow physics",
      "Plant variety with growth rules",
      "Atmospheric art and audio",
    ],
    audience: "Puzzle fans who enjoy clever, light-based environmental challenges.",
    monetization: "Premium unlock; hint IAP; cosmetic garden themes.",
    workPlan: [
      { name: "Concept", tasks: ["Define shadow-growth rules", "Design lamp mechanics", "Map puzzle progression"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype shadow mechanics", "Light-physics spike", "Art style (dark/atmospheric)"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build shadow system", "Implement lamp manipulation", "Create puzzle levels", "Add plant variety"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Puzzle solvability", "Light-physics edge cases", "Difficulty curve"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New puzzle levels", "Seasonal themes", "Community puzzles"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "idle-archaeologist",
    title: "Idle Archaeologist",
    genre: "Idle / incremental",
    coreGameplay:
      "Send teams into ancient ruins, uncover artifacts, restore them, and use discoveries to unlock new civilizations.",
    features: [
      "Team dispatch and idle progression",
      "Artifact discovery and restoration",
      "Civilization unlock tree",
      "Offline earnings",
      "Expedition risk/reward",
      "Museum collection showcase",
    ],
    audience: "Idle/incremental fans who enjoy collection and long-term progression.",
    monetization: "Premium currency; speed-up boosts; ad-free IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define idle loop", "Design artifact/civilization tree", "Map expedition risk"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype idle progression", "Economy balance spike", "Art style"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build team dispatch", "Implement artifacts + restoration", "Create civilization tree", "Add offline earnings"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Idle economy balance", "Offline-earnings correctness", "Progression pacing"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New civilizations", "Seasonal expeditions", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "swipe-soccer-manager",
    title: "Swipe Soccer Manager",
    genre: "Sports / strategy",
    coreGameplay:
      "Control an entire soccer match using quick swipe commands instead of direct player movement. Make tactical decisions in real time.",
    features: [
      "Swipe-command match control",
      "Real-time tactical decisions",
      "Formation and strategy management",
      "Player stats and progression",
      "Season and league structure",
      "Match highlights and replays",
    ],
    audience: "Sports and strategy fans who want tactical depth without direct player control.",
    monetization: "Premium currency; player packs; ad-free IAP.",
    workPlan: [
      { name: "Concept", tasks: ["Define swipe-command map", "Design tactics system", "Map league structure"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype swipe-match loop", "Tactics AI spike", "Match-sim spike"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build swipe commands", "Implement tactics + formations", "Create players + leagues", "Add highlights/replays"], duration: "12 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Match balance", "Tactics AI testing", "League progression"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New leagues/players", "Live events", "Balance patches"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
  {
    id: "animal-escape-room",
    title: "Animal Escape Room",
    genre: "Puzzle / adventure",
    coreGameplay:
      "Different animals use unique abilities to escape rooms. A mouse squeezes through gaps, a parrot copies sounds, and a cat climbs walls.",
    features: [
      "Animal-specific escape abilities",
      "Multi-character puzzle switching",
      "Room-based escape scenarios",
      "Ability-combination puzzles",
      "Charming animal art and animation",
      "Escalating room complexity",
    ],
    audience: "Puzzle/adventure fans who enjoy character-switching and creative ability use.",
    monetization: "Premium unlock; hint IAP; cosmetic animal skins.",
    workPlan: [
      { name: "Concept", tasks: ["Define animal ability set", "Design room scenarios", "Map ability-combo puzzles"], duration: "2 weeks" },
      { name: "Pre-production", tasks: ["Prototype ability-switch loop", "Puzzle-design spike", "Art style (charming)"], duration: "3 weeks", dependencies: "Concept sign-off" },
      { name: "Production", tasks: ["Build character switching", "Implement animal abilities", "Create rooms + puzzles", "Add animation"], duration: "10 weeks", dependencies: "Pre-production prototype" },
      { name: "QA", tasks: ["Puzzle solvability", "Ability-combo testing", "Difficulty curve"], duration: "3 weeks", dependencies: "Production build" },
      { name: "Launch", tasks: ["Store listing + trailer", "Soft launch", "Analytics"], duration: "2 weeks", dependencies: "QA sign-off" },
      { name: "Post-Launch", tasks: ["New animals + rooms", "Seasonal scenarios", "Community puzzles"], duration: "ongoing", dependencies: "Launch" },
    ],
  },
];
