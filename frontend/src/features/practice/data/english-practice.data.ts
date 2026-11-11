import type { Category } from '../../../domain/practice';

const list = (source: string) => source.trim().split(/\s*\|\s*/);

export const ENGLISH_CATEGORIES: readonly Category[] = [
  { id: 'daily', name: 'Daily Life', description: 'Habits, food, home, and everyday routines', color: '#38bdf8' },
  { id: 'favorites', name: 'Favorites', description: 'Hobbies, tastes, animals, and personal interests', color: '#818cf8' },
  { id: 'memories', name: 'Memories', description: 'Past experiences, lessons, and memorable moments', color: '#2dd4bf' },
  { id: 'imagination', name: 'What If?', description: 'Hypothetical situations and creative ideas', color: '#a78bfa' },
  { id: 'values', name: 'Values', description: 'Choices, beliefs, priorities, and ways of thinking', color: '#60a5fa' },
  { id: 'society', name: 'Society & Future', description: 'Technology, communities, and the changing world', color: '#22d3ee' },
  { id: 'work_learning', name: 'Work & Learning', description: 'Careers, study, skills, and personal growth', color: '#4f8cff' },
  { id: 'relationships', name: 'Relationships', description: 'Family, friendship, trust, and communication', color: '#67a3ff' },
  { id: 'entertainment_culture', name: 'Culture & Entertainment', description: 'Film, music, books, games, art, and culture', color: '#7c8cff' },
  { id: 'debate', name: 'Debate', description: 'Take a position and explain your reasoning', color: '#4cb7d8' },
];

const STANDARD_SEEDS: Record<string, string[]> = {
  daily: list('your morning routine|a meal you cook often|the best part of your home|how you spend a rainy day|your relationship with your phone|a small habit that helps you|your ideal weekend|grocery shopping|getting enough sleep|your daily commute|keeping your room tidy|what you carry every day|choosing what to wear|waiting in line|taking a walk|your favorite breakfast|a useful household item|a recent purchase|how you relax at night|something you do without thinking'),
  favorites: list('a food you never get tired of|music you return to|a film you have watched more than once|your favorite place to be alone|a smell you love|an object you use every day|your favorite season|a book you recommend|your usual drink|a sound that calms you|an animal you find fascinating|a photograph you treasure|your favorite color|a shop you enjoy visiting|your favorite time of day|a snack you always choose|a vehicle you would like to own|a game you can play for hours|something you collect|a hobby you would like to try'),
  memories: list('a childhood game|a teacher you remember|your first trip away from home|a family meal|a place where you used to live|a school friend|the first thing you bought with your own money|a mistake you can laugh about now|a compliment you still remember|a dream you had as a child|your first big challenge|a school event|a memorable summer|a graduation|a story you loved when you were younger|something unexpected that happened while traveling|a time you felt nervous|a time someone encouraged you|a hobby you gave up|an unexpected reunion'),
  imagination: list('being invisible for one day|a world where animals can speak|a weekend one hundred years from now|being able to fly|stopping time for ten minutes|living on the Moon|a machine that can make anything|entering someone else’s dream|living as another person for a day|a city under the ocean|a world without spoken language|one week on an empty island|one message to your past self|a new public holiday|your own tiny country|a home without gravity|a screen that plays memories|a station that offers teleportation|a day when nobody ages|a world where emotions have colors'),
  values: list('freedom|happiness|success|trust|courage|fairness|being yourself|hard work|talent|kindness|time|money|stability|taking risks|responsibility|equality|growth|having room to breathe|keeping promises|making difficult choices'),
  society: list('life with artificial intelligence|a cashless society|self-driving cars|shrinking towns|online education|a four-day workweek|working with robots|food waste|empty homes|public transportation|online advertising|an aging population|moving away from cities|renewable energy|stores without staff|remote work|overtourism|the future of libraries|schools ten years from now|privacy in public spaces'),
  work_learning: list('a place where you can focus|a mistake at work|learning a new skill|a good team|taking effective breaks|a task you do well|a task you avoid|feeling proud of your work|building a study habit|teaching someone|asking good questions|managing your time|where you work best|choosing a career|studying for a qualification|productive meetings|a tool that saves you time|staying motivated|starting before you feel ready|your ideal way of working'),
  relationships: list('talking to someone for the first time|a long friendship|spending time with family|showing gratitude|learning to trust someone|disagreeing respectfully|giving a sincere apology|asking for help|setting boundaries|being a good listener|keeping in touch|giving a compliment|asking for advice|meeting someone again after years|saying goodbye|dealing with a difficult person|making up after an argument|something another person taught you|a sentence that changed a relationship|what makes someone reliable'),
  entertainment_culture: list('going to the cinema|a live concert|reading for pleasure|comics and graphic novels|a television show you recommend|video games|visiting a museum|a local festival|stand-up comedy|live theatre|photography|a novel that stayed with you|animation|podcasts and radio|traditional food|local customs|fashion|interesting buildings|watching sports|online creators'),
  debate: list('whether homework is necessary|whether school uniforms are useful|whether cash should remain available|whether a four-day workweek is better|whether phones belong in classrooms|whether cities offer a better life than small towns|whether failure is essential for growth|whether meetings should have strict time limits|whether seniority should affect pay|whether anonymous social media should exist|whether shops should open all night|whether everyone should attend university|whether workplaces need dress codes|whether printed books should be protected|whether popular destinations need visitor limits|whether children need smartphones|whether self-driving cars should be prioritized|whether pet shops should sell animals|whether cashless payment should be the default|whether students should be allowed to use AI tools'),
};

const debateClaim = (seed: string) => seed.replace(/^whether /, '');

const STANDARD_FORMATS: Record<string, ReadonlyArray<(seed: string) => string>> = {
  daily: [
    (seed) => `Tell us about ${seed}.`, (seed) => `What do you like or dislike about ${seed}?`,
    (seed) => `How would you improve ${seed}?`, (seed) => `Describe a recent moment involving ${seed}.`,
    (seed) => `What does ${seed} say about the way you live?`,
  ],
  favorites: [
    (seed) => `Tell us why you enjoy ${seed}.`, (seed) => `What first drew you to ${seed}?`,
    (seed) => `How would you introduce ${seed} to a friend?`, (seed) => `Describe your ideal experience of ${seed}.`,
    (seed) => `What makes ${seed} stand out to you?`,
  ],
  memories: [
    (seed) => `Describe a memory involving ${seed}.`, (seed) => `Who do you associate with ${seed}?`,
    (seed) => `What detail about ${seed} can you still remember clearly?`, (seed) => `What did ${seed} teach you?`,
    (seed) => `How do you feel when you think about ${seed} now?`,
  ],
  imagination: [
    (seed) => `Imagine ${seed}. What happens first?`, (seed) => `What would be the best part of ${seed}?`,
    (seed) => `What unexpected problem could come with ${seed}?`, (seed) => `How would everyday life change with ${seed}?`,
    (seed) => `Tell a short story about ${seed}.`,
  ],
  values: [
    (seed) => `What does ${seed} mean to you?`, (seed) => `Tell us about a time when ${seed} mattered.`,
    (seed) => `Is ${seed} something people can learn?`, (seed) => `What can make ${seed} difficult to protect?`,
    (seed) => `How has your view of ${seed} changed?`,
  ],
  society: [
    (seed) => `How is ${seed} changing everyday life?`, (seed) => `What concerns you most about ${seed}?`,
    (seed) => `Who benefits most from ${seed}?`, (seed) => `What might ${seed} look like ten years from now?`,
    (seed) => `What should society do differently about ${seed}?`,
  ],
  work_learning: [
    (seed) => `What have you learned about ${seed}?`, (seed) => `What makes ${seed} difficult?`,
    (seed) => `What advice would you give a beginner about ${seed}?`, (seed) => `Describe a good experience involving ${seed}.`,
    (seed) => `How would you improve your approach to ${seed}?`,
  ],
  relationships: [
    (seed) => `What matters most when it comes to ${seed}?`, (seed) => `Describe a time when ${seed} went well.`,
    (seed) => `What makes ${seed} difficult?`, (seed) => `What have you learned about ${seed}?`,
    (seed) => `How would you handle ${seed} differently now?`,
  ],
  entertainment_culture: [
    (seed) => `What do you enjoy about ${seed}?`, (seed) => `Tell us about a memorable experience of ${seed}.`,
    (seed) => `How would you introduce ${seed} to a newcomer?`, (seed) => `How has ${seed} changed over time?`,
    (seed) => `What influence can ${seed} have on people?`,
  ],
  debate: [
    (seed) => `Do you agree that ${debateClaim(seed)}? Explain your position.`, (seed) => `Make the strongest case for the view that ${debateClaim(seed)}.`,
    (seed) => `Make the strongest case against the view that ${debateClaim(seed)}.`, (seed) => `What is often overlooked in the debate over ${seed}?`,
    (seed) => `What evidence could change your position on ${seed}?`,
  ],
};

export const ENGLISH_TOPICS = Object.fromEntries(Object.entries(STANDARD_SEEDS).map(([id, seeds]) => [
  id, seeds.flatMap((seed) => STANDARD_FORMATS[id].map((format) => format(seed))),
])) as Record<string, string[]>;

export const ENGLISH_WORD_TOPICS: Record<string, string[]> = {
  daily: list('chair|window|kettle|tomato|umbrella|wallet|mirror|staircase|balcony|laundry|nap|commute|toothbrush|notebook|envelope|bicycle|ticket|crosswalk|breakfast|lunchbox|sunlight|rainstorm|shortcut|payday|alarm|routine|recipe|pantry|blanket|pillow|doormat|thermos|sponge|shoelace|receipt|sidewalk|doorbell|leftovers|dishwasher|laundromat|backpack|headphones|calendar|elevator|neighborhood|traffic|weekend|snack|shower|houseplant|bookshelf|freezer|toaster|scissors|pocket|bus stop|detour|sunset|chores|errand'),
  favorites: list('dog|cat|dolphin|owl|coffee|tea|lemonade|movie|music|novel|photography|painting|perfume|rainfall|starlight|camera|fountain pen|watch|pudding|curry|sushi|strawberry|bookstore|seaside|rooftop|spring|autumn|midnight|handmade|travel|gardening|fishing|hiking|jazz|chocolate|sunflower|aquarium|museum|campfire|vinyl|guitar|poetry|bakery|waterfall|cabin|sneakers|postcard|telescope|board game|origami|pottery|birdsong|thunder|snowfall|cinnamon|hammock|lighthouse|picnic|comedy|souvenir'),
  memories: list('graduation|classroom|playground|teacher|classmate|photograph|letter|fireworks|lunchbox|first love|reunion|promise|applause|backpack|festival|snowball|homesickness|adventure|youth|summer camp|field trip|report card|yearbook|treehouse|hide-and-seek|birthday cake|school bus|uniform|diary|postcard|souvenir|campfire|rainy day|moving day|sleepover|road trip|grandparent|hometown|lullaby|handwriting|sandbox|teammate|first job|old house|family recipe|childhood|mistake|courage|farewell|celebration|tradition|keepsake|nostalgia|laughter|embarrassment|discovery|milestone|anniversary|nickname|photobooth'),
  imagination: list('galaxy|planet|comet|gravity|spaceship|alien|magic|dragon|mermaid|teleportation|time travel|parallel world|underwater city|floating island|maze|ghost ship|talking forest|robot|flying car|invisibility|eternity|miracle|prophecy|moonlight|secret passage|crystal palace|phoenix|unicorn|wizard|portal|dreamscape|sky city|tiny people|giant|shape-shifting|mind reading|superpower|starship|android|hologram|clone|utopia|afterlife|mythical beast|treasure map|enchanted mirror|living painting|endless staircase|memory machine|future city|artificial life|secret society|lost civilization|world tree|magic sword|frozen time|alternate history|dream eater|unknown creature|Kilimanjaro'),
  values: list('hope|freedom|trust|courage|happiness|justice|responsibility|effort|talent|success|failure|stability|growth|independence|cooperation|fairness|equality|kindness|honesty|patience|gratitude|time|money|health|family|friendship|knowledge|experience|truth|promise|choice|regret|destiny|belief|comfort|adventure|order|tradition|innovation|quality|solitude|belonging|empathy|respect|dialogue|reality|ideal|possibility|curiosity|confidence|humility|integrity|loyalty|wisdom|compassion|discipline|generosity|purpose|dignity|balance'),
  society: list('city|population|election|law|welfare|education|healthcare|employment|inflation|housing|railway|airport|traffic|migration|tourism|climate|energy|forest|ocean|recycling|journalism|privacy|public opinion|automation|cryptocurrency|aging|inequality|poverty|diversity|community|hospital|agriculture|industry|earthquake|flood|shelter|sustainability|transparency|digitalization|democracy|taxation|infrastructure|volunteering|public health|renewable energy|remote work|urbanization|cybersecurity|surveillance|citizenship|transportation|consumer rights|disaster relief|free speech|globalization|local government|social media|food security|water supply|public space'),
  work_learning: list('meeting|interview|promotion|overtime|break|business trip|team|organization|leadership|planning|design|sales|research|deadline|feedback|quality|challenge|homework|exam|qualification|reading|revision|question|mathematics|history|geography|concentration|curiosity|judgment|presentation|discussion|essay|project|thesis|craftsmanship|career|internship|mentoring|apprenticeship|workshop|lecture|textbook|calculator|whiteboard|schedule|priority|productivity|collaboration|negotiation|creativity|problem-solving|training|motivation|goal|failure|experience|retirement|entrepreneurship|remote work|time management'),
  relationships: list('friendship|family|romance|promise|conversation|respect|apology|gratitude|trust|neighbor|colleague|mentor|partner|childhood friend|reunion|argument|advice|introduction|welcome|farewell|honesty|secret|rumor|silence|smile|tear|joke|empathy|misunderstanding|jealousy|first impression|phone call|gift|wedding|birthday|listener|shyness|boundary|belonging|teamwork|handshake|invitation|kindness|patience|loyalty|encouragement|compromise|forgiveness|support|distance|affection|conflict|reliability|hospitality|politeness|vulnerability|connection|independence|reconciliation|companionship'),
  entertainment_culture: list('comic|novel|film|music|theatre|comedy|dance|poetry|animation|game|radio|television|streaming|photography|painting|sculpture|architecture|museum|bookstore|festival|fireworks|fashion|cuisine|story|hero|villain|dialogue|ending|sequel|actor|writer|director|musician|mystery|biography|classic|trend|criticism|performance|exhibition|concert|cinema|podcast|documentary|folklore|myth|costume|instrument|stage|audience|soundtrack|script|character|chapter|gallery|ballet|opera|craft|tradition|subculture'),
  debate: list('uniforms|homework|grades|university|cash|taxation|minimum wage|overtime|retirement|social media|anonymity|advertising|privacy|surveillance|artificial intelligence|electric cars|nuclear power|food waste|recycling|cities|tourism|animal testing|vegetarianism|voting age|public manners|nightlife|delivery|subscriptions|competition|equality|efficiency|regulation|responsibility|majority rule|online classes|scholarships|school choice|free speech|censorship|remote work|universal income|immigration|public transport|facial recognition|four-day week|smartphones|screen time|dress codes|standardized tests|renewable energy|carbon tax|plastic bags|cashless payment|self-driving cars|zoos|overtourism|digital books|college debt|workplace monitoring|data ownership'),
};

const COMMON_HINTS = [
  (topic: string) => `How would you explain “${topic}” to someone unfamiliar with it?`,
  (topic: string) => `What is the first specific scene that comes to mind when you hear “${topic}”?`,
  (topic: string) => `What personal experience connects you to “${topic}”?`,
  (topic: string) => `What do you like and dislike about “${topic}”?`,
  (topic: string) => `How has “${topic}” changed over time?`,
  (topic: string) => `What might another person disagree with you about here?`,
  (topic: string) => `What is one surprising detail about “${topic}”?`,
  (topic: string) => `What would happen if “${topic}” disappeared tomorrow?`,
  (topic: string) => `How could “${topic}” be improved?`,
  (topic: string) => `What mistake have you made involving “${topic}”?`,
  (topic: string) => `Who would you most like to discuss “${topic}” with?`,
  (topic: string) => `What is a common misunderstanding about “${topic}”?`,
  (topic: string) => `What lesson can people learn from “${topic}”?`,
  (topic: string) => `What object or image best represents “${topic}”?`,
  (topic: string) => `How would your younger self talk about “${topic}”?`,
  (topic: string) => `What is the strongest argument against your view of “${topic}”?`,
  (topic: string) => `What question about “${topic}” would you ask an expert?`,
  (topic: string) => `What small action related to “${topic}” could you take tomorrow?`,
  (topic: string) => `How does “${topic}” affect everyday life?`,
  (topic: string) => `Can you tell a short story that includes “${topic}”?`,
];

const CATEGORY_ANGLES: Record<string, string[]> = {
  daily: ['convenience', 'routine', 'cost', 'comfort'], favorites: ['personal taste', 'recommendations', 'first impressions', 'lasting appeal'], memories: ['people involved', 'feelings at the time', 'what changed afterward', 'details you still remember'], imagination: ['the first day', 'unexpected problems', 'who would join you', 'how society would change'], values: ['a difficult choice', 'the opposite value', 'a real-life example', 'what shaped your view'], society: ['who benefits', 'who may be harmed', 'long-term effects', 'what individuals can do'], work_learning: ['beginner advice', 'a useful method', 'a common mistake', 'the ideal environment'], relationships: ['the other person’s view', 'healthy boundaries', 'a specific conversation', 'how trust is built'], entertainment_culture: ['a memorable scene', 'the creator’s intention', 'cultural influence', 'how it may change'], debate: ['the strongest argument for it', 'the strongest argument against it', 'a reasonable exception', 'what could change your mind'],
};

export function getEnglishHintCandidates(categoryId: string, topic: string) {
  const angles = CATEGORY_ANGLES[categoryId] ?? [];
  return [
    ...COMMON_HINTS.map((create) => create(topic)),
    ...angles.flatMap((angle) => [
      `How does ${angle} relate to “${topic}”?`, `Look at “${topic}” through the lens of ${angle}.`,
      `Give a concrete example connecting “${topic}” and ${angle}.`, `What would you say about ${angle} when discussing “${topic}”?`,
      `Use ${angle} as a starting point and continue talking about “${topic}”.`,
    ]),
  ];
}
