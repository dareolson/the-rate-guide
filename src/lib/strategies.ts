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

  // ============================================================
  "Associate Producer__Emerging": [
    {
      category: "Foundations",
      items: [
        "Learn the full production pipeline — you need to see every department",
        "Master the tools: budgeting software, scheduling apps, call sheet formats",
        "Be the person who solves problems before they reach the producer",
        "Understand clearances, releases, and basic contract language",
      ],
    },
  ],
  "Associate Producer__Mid": [
    {
      category: "Ownership",
      items: [
        "Run segments or secondary shoots without supervision",
        "Develop vendor relationships the producer can rely on through you",
        "Understand post-production well enough to coordinate it",
        "Build a reputation for being organized under pressure",
      ],
    },
  ],
  "Associate Producer__Senior": [
    {
      category: "Path to Producer",
      items: [
        "Step up as line producer when the opportunity comes — take the risk",
        "Build direct relationships with clients and brands",
        "Develop a specialization: commercial, doc, branded content",
        "Mentor coordinators and PAs below you",
      ],
    },
  ],
  "Associate Producer__Expert": [
    {
      category: "Authority",
      items: [
        "You should be producing, not associating — push for the title and rate",
        "Use your AP credits as a launching pad for EP conversations",
        "Build a roster of clients who ask for you specifically",
      ],
    },
  ],

  // ============================================================
  "1st AD__Emerging": [
    {
      category: "Set Control",
      items: [
        "The set runs on your voice — learn to project authority without aggression",
        "Master the shot list and schedule before the crew arrives",
        "Learn to read a director and translate their vision into a workable day",
        "Know every department head's job well enough to anticipate their needs",
      ],
    },
    {
      category: "Logistics",
      items: [
        "Build bulletproof call sheets — every detail, no ambiguity",
        "Learn to compress a schedule without losing the director's trust",
        "Develop a system for tracking scene coverage in real time",
        "Study union rules and turnaround requirements — violations are your fault",
      ],
    },
  ],
  "1st AD__Mid": [
    {
      category: "Department Leadership",
      items: [
        "Train your 2nd AD and Key PA — their mistakes reflect on you",
        "Develop a reputation for protecting the schedule without killing morale",
        "Build relationships with DPs who like working with you — it books jobs",
        "Get comfortable with large crews: 50+ people looking to you for answers",
      ],
    },
  ],
  "1st AD__Senior": [
    {
      category: "Feature & Episodic Work",
      items: [
        "Push for feature or long-form episodic credits",
        "Join the DGA if your market and ambitions support it",
        "Develop a reputation with specific directors who request you by name",
        "Build relationships with UPMs — they hire ADs, not the other way around",
      ],
    },
  ],
  "1st AD__Expert": [
    {
      category: "Elite",
      items: [
        "Major studio or streaming credits with recognizable titles",
        "DGA membership and standing in your market",
        "Directors who won't shoot without you",
        "Mentorship of emerging ADs as a reputation multiplier",
      ],
    },
  ],

  // ============================================================
  "2nd AD__Emerging": [
    {
      category: "Foundations",
      items: [
        "Master paperwork: production reports, exhibit Gs, movement orders",
        "Learn to manage talent — pickups, holding, turnaround",
        "Be the 1st AD's right hand before they ask",
        "Know the call sheet inside out — you often build it",
      ],
    },
  ],
  "2nd AD__Mid": [
    {
      category: "Set Skills",
      items: [
        "Develop talent wrangling skills: calm, firm, professional",
        "Build a reputation for clean paperwork — it gets you rehired",
        "Learn to anticipate scheduling changes before the 1st AD calls them",
        "Study 1st AD work — your path runs through them",
      ],
    },
  ],
  "2nd AD__Senior": [
    {
      category: "Transition",
      items: [
        "Step up to 1st AD on smaller projects to build the credit",
        "Develop a specialization: commercial, reality, narrative",
        "Build direct relationships with producers and UPMs",
        "Mentor 2nd 2nds and PAs — your reputation travels with your team",
      ],
    },
  ],
  "2nd AD__Expert": [
    {
      category: "Authority",
      items: [
        "You should be a 1st AD by now — use the title and rate accordingly",
        "Major credits in your discipline",
        "Known in your market as someone who makes the set run",
      ],
    },
  ],

  // ============================================================
  "Key Grip__Emerging": [
    {
      category: "Foundations",
      items: [
        "Know every piece of grip equipment by name and function — no hesitation on set",
        "Understand the relationship between grip and electric — they work in parallel",
        "Learn rigging: speed rails, scaffolding, camera mounts",
        "Study the physics of lighting support — safe, fast, invisible",
      ],
    },
    {
      category: "Set Etiquette",
      items: [
        "Be the fastest person to build and strike your department",
        "Develop a relationship with the DP — grip makes the DP's vision possible",
        "Build a reliable team of grips you can bring to any project",
        "Show up with a full kit — your tools are your rate justification",
      ],
    },
  ],
  "Key Grip__Mid": [
    {
      category: "Technical Expansion",
      items: [
        "Add specialty rigging: car mounts, crane operation, underwater support",
        "Develop dolly operation skills — smooth is a craft",
        "Learn to design a full grip package for a commercial shoot",
        "Build vendor relationships for equipment you don't own",
      ],
    },
  ],
  "Key Grip__Senior": [
    {
      category: "Department Command",
      items: [
        "Run a full grip department on a feature or episodic",
        "Mentor your Best Boy and grips — department quality is your responsibility",
        "Build DP relationships that follow you project to project",
        "Know union rates and rules if your market supports it (IATSE Local 80)",
      ],
    },
  ],
  "Key Grip__Expert": [
    {
      category: "Elite",
      items: [
        "Major feature or streaming credits with recognizable DPs",
        "IATSE standing in your market",
        "DPs who request you by name",
        "Your department runs without you micromanaging it",
      ],
    },
  ],

  // ============================================================
  "Best Boy Grip__Emerging": [
    {
      category: "Foundations",
      items: [
        "Know the full grip inventory — every piece, every function",
        "Learn to run the truck: organization, inventory, maintenance",
        "Be the Key Grip's operational right hand",
        "Build relationships with equipment houses and vendors",
      ],
    },
  ],
  "Best Boy Grip__Mid": [
    {
      category: "Operations",
      items: [
        "Own the equipment budget — track expendables, rentals, damage",
        "Manage the grip crew day-to-day so the Key can focus on the DP",
        "Develop hiring relationships — you'll build the crew for the Key",
        "Step up as Key on smaller projects to build the credit",
      ],
    },
  ],
  "Best Boy Grip__Senior": [
    {
      category: "Transition",
      items: [
        "Push for Key Grip credits on the right projects",
        "Build a reputation for running a clean, fast department",
        "Develop relationships with UPMs and production coordinators who hire crew",
      ],
    },
  ],
  "Best Boy Grip__Expert": [
    {
      category: "Authority",
      items: [
        "You should be a Key Grip — use that title and rate",
        "Major credits and a reliable crew network",
        "Known as someone who makes the department run regardless of conditions",
      ],
    },
  ],

  // ============================================================
  "Grip__Emerging": [
    {
      category: "Foundations",
      items: [
        "Learn every piece of grip equipment — sandbags to speed rails to dollies",
        "Be fast, quiet, and safe — those are the three rules on set",
        "Study what the Key and Best Boy are doing — that's your path",
        "Show up with your own basic tools: gloves, multi-tool, black wrap",
      ],
    },
  ],
  "Grip__Mid": [
    {
      category: "Specialization",
      items: [
        "Develop a specialty: dolly, rigging, or crane operation",
        "Build relationships with Key Grips who rehire reliable people",
        "Expand your kit — the more you bring, the more you're worth",
        "Study the Best Boy role — that's your next step",
      ],
    },
  ],
  "Grip__Senior": [
    {
      category: "Path Up",
      items: [
        "Step up to Best Boy on smaller projects",
        "Build a reputation for speed, safety, and reliability",
        "Develop vendor and equipment house relationships",
      ],
    },
  ],
  "Grip__Expert": [
    {
      category: "Authority",
      items: [
        "At this level you should be Key Grip or Best Boy",
        "Major credits and a crew network that follows you",
        "Specialty skills that justify your rate above all others",
      ],
    },
  ],

  // ============================================================
  "Gaffer__Emerging": [
    {
      category: "Electrical Foundations",
      items: [
        "Know your load calculations — electrical safety is non-negotiable",
        "Be fluent in every fixture type: tungsten, HMI, LED, practical",
        "Understand the DP's language and translate it into a lighting plan",
        "Learn to work fast with minimal gear — efficiency is a craft",
      ],
    },
    {
      category: "Set Skills",
      items: [
        "Build a relationship with the Key Grip — you work as one department",
        "Learn power distribution inside out: distro boxes, generators, tie-ins",
        "Develop a reliable Best Boy Electric — your department runs through them",
        "Build your kit: the more you own, the more you earn",
      ],
    },
  ],
  "Gaffer__Mid": [
    {
      category: "Technical Expansion",
      items: [
        "Add LED and wireless DMX control to your expertise",
        "Develop a lighting design sense, not just execution",
        "Build generator and location power expertise",
        "Get comfortable designing lighting packages for full commercial shoots",
      ],
    },
  ],
  "Gaffer__Senior": [
    {
      category: "Department Command",
      items: [
        "Run a full electric department on a feature or episodic",
        "Develop DP relationships that follow you across projects",
        "Know IATSE Local 728 rules if your market supports union work",
        "Mentor your Best Boy Electric — department quality is yours to own",
      ],
    },
  ],
  "Gaffer__Expert": [
    {
      category: "Elite",
      items: [
        "Major feature or streaming credits with recognizable DPs",
        "IATSE standing in your market",
        "DPs who request you by name regardless of budget",
        "Your lighting designs are referenced by other gaffers",
      ],
    },
  ],

  // ============================================================
  "Sound Mixer__Emerging": [
    {
      category: "Technical Foundations",
      items: [
        "Know your recording chain cold: mic, preamp, recorder, monitoring",
        "Master lav placement — invisible and clean is the goal",
        "Understand boom technique: angle, proximity, rejection",
        "Learn to work quietly and invisibly — sound is often the last priority until it's the first problem",
      ],
    },
    {
      category: "Kit",
      items: [
        "Build a professional kit: recorder, boom, lavs, wireless systems",
        "Know your gear's limitations before the shoot, not during",
        "Develop relationships with sound rental houses",
        "Your kit is your rate — invest in it strategically",
      ],
    },
  ],
  "Sound Mixer__Mid": [
    {
      category: "Expansion",
      items: [
        "Add more wireless channels — complex shoots demand it",
        "Develop production sound report discipline — post will thank you",
        "Build relationships with post sound supervisors who can refer you",
        "Learn to manage a boom operator and utility — your department grows",
      ],
    },
  ],
  "Sound Mixer__Senior": [
    {
      category: "Department Leadership",
      items: [
        "Run sound on full feature or episodic productions",
        "CAS membership if your market and credits support it",
        "Build DP and director relationships — good sound starts in pre-production",
        "Develop a reputation for clean production audio that post doesn't need to fix",
      ],
    },
  ],
  "Sound Mixer__Expert": [
    {
      category: "Elite",
      items: [
        "Major feature or streaming credits",
        "CAS membership and standing",
        "Directors and producers who won't shoot without you",
        "Your production audio requires minimal post intervention",
      ],
    },
  ],

  // ============================================================
  "Production Assistant__Emerging": [
    {
      category: "Foundations",
      items: [
        "Be the most reliable person on set — that's your entire job description",
        "Learn every department name and what they do before your first day",
        "Master set walkie etiquette — how you sound on the radio matters",
        "Anticipate needs: if someone might want water, coffee, or a copy, have it ready",
      ],
    },
    {
      category: "Getting Ahead",
      items: [
        "Identify which department you want to move into and study it",
        "Build relationships with the 2nd AD — they do the hiring",
        "Never complain, never disappear, never be on your phone",
        "Volunteer for the hardest tasks — that's how you get remembered",
      ],
    },
  ],
  "Production Assistant__Mid": [
    {
      category: "Moving Up",
      items: [
        "Target a department and start showing up as that person",
        "Build a reputation with specific 1st ADs and coordinators who rehire you",
        "Learn the paperwork of your target department",
        "Ask to observe — most department heads will let a reliable PA watch",
      ],
    },
  ],
  "Production Assistant__Senior": [
    {
      category: "Transition",
      items: [
        "You should be moving into a department by now — PA is a stepping stone",
        "Use your set relationships to get into your target discipline",
        "Build a reputation as someone who makes the set run",
      ],
    },
  ],
  "Production Assistant__Expert": [
    {
      category: "Authority",
      items: [
        "At Expert level you should be Key PA or in a department role",
        "If you're still a general PA, specialize or step into coordination",
        "Your value is your reliability, speed, and knowledge of the set",
      ],
    },
  ],

  // ============================================================
  "Key PA__Emerging": [
    {
      category: "Foundations",
      items: [
        "You manage the PA department — know every PA's assignment at all times",
        "Be the 2nd AD's operational right hand on set",
        "Build reliable communication between ADs and all departments",
        "Know base camp, holding, and set logistics cold",
      ],
    },
  ],
  "Key PA__Mid": [
    {
      category: "Set Leadership",
      items: [
        "Train and manage your PA team — their mistakes are yours to fix",
        "Develop a reputation for running a tight, fast base camp",
        "Build relationships with 1st and 2nd ADs who request you",
        "Study 2nd AD work — that's your path",
      ],
    },
  ],
  "Key PA__Senior": [
    {
      category: "Path to AD",
      items: [
        "Step up to 2nd AD on the right project — take the risk",
        "Build direct relationships with UPMs and production coordinators",
        "Develop a specialization: commercial, narrative, reality",
      ],
    },
  ],
  "Key PA__Expert": [
    {
      category: "Authority",
      items: [
        "You should be a 2nd AD — push for the title and rate",
        "Major credits across disciplines",
        "Known as someone who makes the AD department run",
      ],
    },
  ],
};
