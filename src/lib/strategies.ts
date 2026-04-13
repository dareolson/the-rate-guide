// ==============================================
// The Rate Guide — Rate Justification Strategies
// Discipline-specific proficiencies, skills, credits,
// and positioning moves that justify a higher rate.
// Key format: "Discipline__ExperienceLevel"
// ==============================================

interface StrategySection {
  category: string;
  items:    string[];
}

type StrategyKey = string;

export const STRATEGIES: Record<StrategyKey, StrategySection[]> = {

  // ============================================================
  "Cinematographer / DP__Emerging": [
    {
      category: "Craft Foundations",
      items: [
        "Master exposure — know your camera's latitude cold, not just the basics",
        "Understand color temperature and white balance beyond auto settings",
        "Learn to light with minimal gear: 1-light, 2-light setups that look intentional",
        "Study frame composition — rule of thirds is the floor, not the ceiling",
      ],
    },
    {
      category: "Technical Credibility",
      items: [
        "Be fluent in at least one professional camera system (ARRI, RED, Sony FX)",
        "Understand codec choices and how they affect post — give editors clean files",
        "Learn basic color grading — even a passing knowledge builds client trust",
        "Know your LUTs and when to use them vs when not to",
      ],
    },
    {
      category: "Portfolio Moves",
      items: [
        "Shoot spec work for real brands — treat it like a paid job",
        "Get one festival submission — any festival, any film",
        "Document your process. Clients hire people they understand.",
        "Collaborate with editors and directors — build relationships early",
      ],
    },
  ],

  "Cinematographer / DP__Mid": [
    {
      category: "Narrative & Storytelling",
      items: [
        "Build a reel that shows range across formats: narrative, commercial, doc",
        "Develop a visual language — your work should be recognizable",
        "Get comfortable with shot-listing and pre-production collaboration",
        "Understand coverage: when to use it, when to resist it",
      ],
    },
    {
      category: "Client & Set Skills",
      items: [
        "Learn to move fast without sacrificing quality — speed is a skill",
        "Develop producer-level thinking: budget, schedule, tradeoffs",
        "Handle clients on set without a buffer — direct communication matters",
        "Build a reliable crew you can bring to any project",
      ],
    },
    {
      category: "Technical Expansion",
      items: [
        "Add motion control or gimbal fluency to your skill set",
        "Understand drone operation or have a trusted operator on call",
        "Get comfortable with LED walls or virtual production basics",
        "Know how to design a lighting package for a full commercial shoot",
      ],
    },
  ],

  "Cinematographer / DP__Senior": [
    {
      category: "Command of the Set",
      items: [
        "You should be the calmest person on set — composure is a rate multiplier",
        "Mentor your AC and gaffer — your team reflects your value",
        "Develop department head-level budget management skills",
        "Build a reputation for bringing projects in on time and on budget",
      ],
    },
    {
      category: "Credits That Pay",
      items: [
        "Push for festival-circuit narrative credits — Cannes, Sundance, SXSW",
        "Land at least one national broadcast or streaming credit",
        "Document recognizable brands in your reel — logos do the talking",
        "Get one Olympic, sports, or live event credit if movement is your strength",
      ],
    },
    {
      category: "Positioning",
      items: [
        "Specialize without narrowing too far — known for a look, available for range",
        "Speak at industry events, workshops, or film schools",
        "Build relationships with high-level producers, not just directors",
        "Negotiate back-end credits on passion projects — build IP relationships",
      ],
    },
  ],

  "Cinematographer / DP__Expert": [
    {
      category: "Legacy Positioning",
      items: [
        "Your name should be searchable and what comes up should command respect",
        "Awards and nominations from credible festivals or guilds",
        "Representation — an agent or manager separates you from the crowd",
        "Teaching, speaking, or publishing — authority compounds over time",
      ],
    },
    {
      category: "Rate Defense",
      items: [
        "Stop justifying your rate — present it and be silent",
        "Itemize your value: creative, technical, relationships, reliability",
        "Reference comparable credits when challenged — calmly",
        "Know your walk-away number and mean it",
      ],
    },
  ],

  // ============================================================
  "Camera Operator__Emerging": [
    {
      category: "Physical & Technical Skills",
      items: [
        "Master handheld operation — smooth is a skill, learn to control your body",
        "Get certified or practiced on one stabilization system: Steadicam, gimbal",
        "Know every camera system you might be handed — don't ask basic questions on set",
        "Study focus pulling — understanding AC work makes you a better operator",
      ],
    },
    {
      category: "Set Etiquette",
      items: [
        "Be the most prepared person in the room before the call sheet says action",
        "Learn to anticipate what the DP wants — watch, don't wait to be told",
        "Build AC and grip relationships — your reputation travels with your crew",
        "Show up early, stay late, say less",
      ],
    },
  ],

  "Camera Operator__Mid": [
    {
      category: "Specialization",
      items: [
        "Develop a specialty: sports, live events, narrative, ENG",
        "Get Steadicam certified if you haven't — it opens a tier of work",
        "Add drone or underwater operation if your market supports it",
        "Build a kit that makes you a complete package, not just a pair of hands",
      ],
    },
    {
      category: "Credits & Relationships",
      items: [
        "Work under DPs you want to become — proximity to excellence matters",
        "Get broadcast credits — news, sports, or reality TV builds credibility fast",
        "Document your best work and put it in front of production companies",
      ],
    },
  ],

  "Camera Operator__Senior": [
    {
      category: "Authority",
      items: [
        "You should be able to run a shoot without a DP if needed",
        "Train and mentor operators below you — generosity builds reputation",
        "Get on union rosters if your market supports it (IATSE, SAG-AFTRA adjacent)",
        "Your name should come up when a DP needs a trusted B-camera op",
      ],
    },
  ],

  "Camera Operator__Expert": [
    {
      category: "Elite Position",
      items: [
        "Your availability should be the constraint, not your rate",
        "Feature film or major broadcast series credits",
        "Recognized specialty at the top of your niche",
        "Other operators ask you for advice — leverage that into teaching income",
      ],
    },
  ],

  // ============================================================
  "Video Editor__Emerging": [
    {
      category: "Technical Mastery",
      items: [
        "Be fast in at least one NLE — Premiere or Resolve, inside out",
        "Understand color grading basics — don't hand off flat footage",
        "Learn audio fundamentals: clean cuts, music pacing, basic mix",
        "Master motion graphics basics in After Effects — titles and transitions",
      ],
    },
    {
      category: "Storytelling",
      items: [
        "Study the edit, not just the footage — watch films analytically",
        "Develop a sense of pacing — when to cut, when to hold",
        "Learn to edit for emotion, not just sequence",
        "Spec edit existing footage to build a reel without client work",
      ],
    },
  ],

  "Video Editor__Mid": [
    {
      category: "Expanded Skills",
      items: [
        "Add color grading as a billable skill, not just a finishing step",
        "Get comfortable with basic audio mixing and sound design",
        "Develop motion graphics capabilities beyond templates",
        "Learn to edit long-form as well as short — both markets pay",
      ],
    },
    {
      category: "Client Skills",
      items: [
        "Manage revision rounds without losing your mind or your relationship",
        "Deliver organized, labeled exports — make the client's life easy",
        "Build a feedback process that protects your time",
        "Learn to say no to endless revisions — scope is a skill",
      ],
    },
  ],

  "Video Editor__Senior": [
    {
      category: "Department Leadership",
      items: [
        "Supervise junior editors — your output quality scales through others",
        "Own the full post pipeline from ingest to delivery",
        "Develop broadcast or streaming delivery expertise",
        "Build relationships with colorists, composers, and VFX leads",
      ],
    },
  ],

  "Video Editor__Expert": [
    {
      category: "Industry Standing",
      items: [
        "Feature film or major streaming series credits",
        "ACE membership or equivalent guild standing if applicable",
        "Your reel includes work people have seen and remember",
        "Teaching, consulting, or editorial supervision as a revenue stream",
      ],
    },
  ],

  // ============================================================
  "Colorist__Emerging": [
    {
      category: "Foundations",
      items: [
        "Master DaVinci Resolve — it is the industry standard, full stop",
        "Understand color science: color spaces, gamma, LUTs, transforms",
        "Learn to grade for multiple deliverables: broadcast, web, cinema",
        "Study reference material — know what well-graded work looks like",
      ],
    },
  ],

  "Colorist__Mid": [
    {
      category: "Specialization",
      items: [
        "Develop a signature look without making every project look the same",
        "Get comfortable with HDR grading workflows",
        "Build facility relationships — studio colorists earn more",
        "Understand VFX integration — your grade comes after or with effects",
      ],
    },
  ],

  "Colorist__Senior": [
    {
      category: "Credits & Tools",
      items: [
        "Feature or episodic credits in your reel",
        "Add Baselight or Lustre to your toolkit if targeting high-end work",
        "Develop relationships with major post houses",
        "Consult on-set for productions doing live grading",
      ],
    },
  ],

  "Colorist__Expert": [
    {
      category: "Elite",
      items: [
        "Your name is in the credits of films people have seen",
        "You set the look, not just execute it",
        "Direct client relationships with studios or networks",
      ],
    },
  ],

  // ============================================================
  "Motion Designer__Emerging": [
    {
      category: "Tool Fluency",
      items: [
        "Master After Effects — expressions, shape layers, timing",
        "Learn Cinema 4D or Blender basics for 3D elements",
        "Build a design foundation: typography, color theory, hierarchy",
        "Study motion principles: anticipation, follow-through, easing",
      ],
    },
  ],

  "Motion Designer__Mid": [
    {
      category: "Expansion",
      items: [
        "Add 3D as a real skill, not a novelty",
        "Develop brand identity design capabilities — logos in motion",
        "Learn to work with a style guide and stay inside it",
        "Build broadcast package experience if that market interests you",
      ],
    },
  ],

  "Motion Designer__Senior": [
    {
      category: "Leadership",
      items: [
        "Creative direct an entire campaign, not just one deliverable",
        "Develop a client-facing presence — present your work, don't just deliver it",
        "Build a team of junior designers you can manage",
        "Develop a recognizable aesthetic while remaining flexible",
      ],
    },
  ],

  "Motion Designer__Expert": [
    {
      category: "Authority",
      items: [
        "Your work is in the cultural record — campaigns people remember",
        "Speaking, teaching, or publishing in your field",
        "Studio or agency partnerships at the creative direction level",
      ],
    },
  ],

  // ============================================================
  "Producer__Emerging": [
    {
      category: "Foundations",
      items: [
        "Build bulletproof budgets — every line item, no surprises",
        "Master scheduling: call sheets, shoot schedules, post schedules",
        "Learn to negotiate with vendors without burning relationships",
        "Understand contracts: work-for-hire, licensing, crew agreements",
      ],
    },
  ],

  "Producer__Mid": [
    {
      category: "Expansion",
      items: [
        "Manage full productions end-to-end without hand-holding",
        "Develop location scouting and permitting expertise",
        "Build a reliable vendor and crew network",
        "Understand post-production workflows well enough to supervise them",
      ],
    },
  ],

  "Producer__Senior": [
    {
      category: "Authority",
      items: [
        "Executive produce — take creative and financial responsibility",
        "Build agency and brand relationships at the decision-maker level",
        "Develop a reputation for bringing difficult projects home",
        "Mentor line producers and coordinators below you",
      ],
    },
  ],

  "Producer__Expert": [
    {
      category: "Elite",
      items: [
        "Your name on a project is a signal of quality to clients",
        "Multiple major credits across disciplines",
        "Ownership stake in productions, not just fees",
        "Strategic partnerships with studios, brands, or networks",
      ],
    },
  ],
};
