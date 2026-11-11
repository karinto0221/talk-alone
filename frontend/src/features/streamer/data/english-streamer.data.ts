const split = (source: string) => source.trim().split(/\s*\|\s*/);

const conversationTopics = split('your current obsession|the best snack for a late night|a movie you can rewatch forever|the last thing that made you laugh|your ideal day off|a hobby you want to try|the app you use most|a food you used to dislike|your favorite kind of weather|the best way to spend a rainy day|a song stuck in your head|a small purchase that improved your life|your most-used emoji|the weirdest thing in your room|your usual breakfast|a place you want to revisit|the best smell in the world|a skill you wish you had|a fictional world you would live in|your favorite convenience food|the last photo on your phone|an animal you would like to meet|your go-to karaoke song|a chore you secretly enjoy|the best seat on a train|your favorite time of day|something you always carry|the most useful thing you own|a trend you never understood|the perfect sandwich|your favorite holiday tradition|a subject you could talk about for hours|the first website you check each day|a game you were obsessed with|your favorite sound|a place where you can truly relax|the nicest compliment you remember|a childhood snack|the best thing about your hometown|something you recently learned');

const questionFrames = [
  (topic: string) => `What do you think about ${topic}?`,
  (topic: string) => `Tell us about ${topic}.`,
  (topic: string) => `I need to know: what is ${topic} for you?`,
  (topic: string) => `Quick question—what comes to mind when you hear “${topic}”?`,
  (topic: string) => `Could you talk about ${topic} for a minute?`,
];

const choices = [
  ['crispy fries', 'soft fries'], ['coffee', 'tea'], ['cats', 'dogs'], ['summer', 'winter'], ['sunrise', 'sunset'],
  ['books', 'movies'], ['sweet snacks', 'salty snacks'], ['city life', 'country life'], ['texting', 'phone calls'], ['early mornings', 'late nights'],
  ['window seat', 'aisle seat'], ['cooking', 'ordering in'], ['beaches', 'mountains'], ['comedy', 'horror'], ['hot weather', 'cold weather'],
  ['plans', 'spontaneity'], ['paper books', 'e-books'], ['music', 'podcasts'], ['cake', 'ice cream'], ['walking', 'cycling'],
  ['one long vacation', 'several short trips'], ['saving money', 'spending on experiences'], ['working alone', 'working with a team'], ['a tidy room', 'organized chaos'], ['breakfast', 'dinner'],
  ['rain', 'snow'], ['board games', 'video games'], ['photos', 'videos'], ['a familiar favorite', 'something new'], ['stairs', 'elevators'],
  ['being too early', 'being slightly late'], ['a quiet café', 'a busy restaurant'], ['live music', 'studio recordings'], ['subtitles', 'dubbing'], ['home workouts', 'the gym'],
  ['a detailed plan', 'figuring it out as you go'], ['one best friend', 'a big friend group'], ['public transport', 'driving'], ['minimalism', 'collecting things'], ['asking for help', 'solving it alone'],
] as const;

const choiceFrames = [
  (a: string, b: string) => `${a} or ${b}?`,
  (a: string, b: string) => `Be honest: ${a} or ${b}?`,
  (a: string, b: string) => `You can only keep one—${a} or ${b}?`,
  (a: string, b: string) => `Which side are you on: ${a} or ${b}?`,
  (a: string, b: string) => `For the rest of this year, would you choose ${a} or ${b}?`,
];

const dailyReports = split('I found money in an old coat pocket today|my neighbor’s cat finally let me pet it|I tried making bread and somehow made a brick|the bus driver waited when they saw me running|I cleaned my desk and now I cannot find anything|I heard my favorite song in a grocery store|I took a nap and woke up thinking it was tomorrow|a kid waved at me from the next car|I ordered something online and forgot what it was|I made dinner without looking at a recipe|I wore mismatched socks all day without noticing|my plant grew a new leaf and I am weirdly proud|I caught the train with two seconds to spare|I went for a walk and discovered a tiny park|I finally replied to a message from three weeks ago|my coffee tasted unusually good this morning|I saw a dog carrying its own umbrella|I reorganized one drawer and called it a productive day|I remembered a joke hours after the conversation ended|I bought a snack because the package looked nice|I accidentally took the scenic route home|I found an old playlist and every song still works|I tried a new haircut and I am still deciding how I feel|I cooked too much pasta again|the vending machine gave me two drinks|I spent ten minutes looking for my phone while holding it|I learned that my favorite mug is microwave-safe after all|I saw the moon during the afternoon|I finally finished a book I started months ago|someone complimented my shoes today|I woke up before my alarm and felt unstoppable|I learned how to fold a fitted sheet—almost|I chose the fastest checkout line and it was actually fast|I heard someone laughing so hard that I started laughing too|I took a photo that looked much better than expected|I fixed something without watching a tutorial|I had breakfast for dinner|I remembered to bring an umbrella before it rained|I found the exact thing I wanted on sale|I managed to keep a surprise secret');

const reportFrames = [
  (report: string) => `${report}.`,
  (report: string) => `Random update: ${report}.`,
  (report: string) => `This is not important, but ${report}.`,
  (report: string) => `Today’s tiny victory: ${report}.`,
  (report: string) => `I just wanted to share that ${report}.`,
];

const hypotheticals = split('you could pause time for ten minutes|animals could leave online reviews|your fridge could talk|you had to live in a shopping mall for a week|every lie made a bell ring|you could instantly master one instrument|you woke up in your favorite fictional world|you could remove one minor inconvenience from daily life|your pet could ask one question|you had a personal theme song everywhere you went|you could swap jobs with anyone for a day|you had to eat one meal for a month|you could add one new holiday to the calendar|you could teleport, but only to places you have visited|your dreams appeared as movies the next morning|you could bring back one discontinued product|you had to rename the Moon|you could talk to your future self for five minutes|you could make one household chore disappear forever|you received free travel but could only pack one bag|you could live in any decade for one year|your phone battery never ran out|you had to teach a class with no preparation|you could understand every language but not speak them|you could make one fictional object real|your hometown became the capital of the world|you had a button that produced any snack|you could become invisible only while sneezing|you could give everyone one harmless superpower|you were in charge of designing a new planet|you had to spend a year without clocks|one room in your home became twice as large|you could replay one ordinary day|you had to choose a mascot for humanity|all stairs were replaced by slides|you could ask your past self one question|you could add one feature to the human body|you had to open a very specific museum|every day had an extra hour|you could make one sound vanish forever');

const hypotheticalFrames = [
  (idea: string) => `What would you do if ${idea}?`,
  (idea: string) => `Imagine ${idea}. What happens first?`,
  (idea: string) => `How would your life change if ${idea}?`,
  (idea: string) => `Would it actually be good if ${idea}?`,
  (idea: string) => `You wake up and ${idea}. Talk us through the day.`,
];

const reactions = split('I always forget why I walked into a room|soup is a drink if you are brave enough|the hardest part of cooking is deciding what to cook|every group chat has one person who replies three days later|new notebooks are almost too nice to write in|the weather app feels more like a suggestion|folding laundry is never truly finished|choosing a movie takes longer than watching it|the last five minutes before an alarm are the best sleep|a sandwich tastes better when someone else makes it|there is no graceful way to run for a train|online recipes always hide the useful part under a life story|the cold side of a pillow deserves an award|a clean room changes your whole personality for ten minutes|opening a difficult jar feels like winning a championship|the first pancake is always a practice pancake|one missing sock can ruin an entire laundry load|the best parking space appears right after you give up|a pen becomes precious the moment someone borrows it|the microwave countdown is impossible not to watch|a chair becomes a clothes rack sooner or later|weekends move at double speed|the supermarket is more dangerous when you are hungry|finding an outlet in public feels like finding treasure|the most comfortable clothes are never the stylish ones|a five-minute break can somehow become an hour|ice cream tastes better straight from the container|every cable tangles itself when nobody is looking|the volume is either too quiet or suddenly too loud|a familiar song can change your mood immediately|the word queue has far too many silent letters|a tiny task becomes huge after you postpone it|nothing makes you productive like avoiding another task|a fresh haircut never looks the same the next morning|the perfect avocado exists for about six minutes|people walk differently when carrying a hot drink|the remote control only disappears when you need it|a good nap is basically time travel|the first sip of water at night is unbeatable|remembering someone’s name under pressure is impossible');

const reactionFrames = [
  (text: string) => `${text}.`,
  (text: string) => `Hot take: ${text}.`,
  (text: string) => `Tell me I’m wrong: ${text}.`,
  (text: string) => `I have a theory that ${text}.`,
  (text: string) => `Can we agree that ${text}?`,
];

export const ENGLISH_STREAMER_COMMENTS = [
  ...conversationTopics.flatMap((topic) => questionFrames.map((frame) => frame(topic))),
  ...choices.flatMap(([a, b]) => choiceFrames.map((frame) => frame(a, b))),
  ...dailyReports.flatMap((report) => reportFrames.map((frame) => frame(report))),
  ...hypotheticals.flatMap((idea) => hypotheticalFrames.map((frame) => frame(idea))),
  ...reactions.flatMap((reaction) => reactionFrames.map((frame) => frame(reaction))),
];

const adjectives = split('Blue|Quiet|Lucky|Sleepy|Tiny|Curious|Sunny|Midnight|Cosmic|Mellow|Wandering|Silver|Gentle|Clever|Rainy|Neon|Cozy|Brave|Velvet|Electric|Golden|Hidden|SlightlyLost|Weekend|Pocket');
const nouns = split('Penguin|Otter|Badger|Panda|Fox|Koala|Raccoon|Sparrow|Turtle|Gecko|Teapot|Pretzel|Mochi|Waffle|Noodle|Mango|Cactus|Cloud|Comet|Lantern|Pebble|Socks|Notebook|Kettle|Umbrella');

export const ENGLISH_STREAMER_USERNAMES = [
  ...adjectives.flatMap((adjective) => nouns.map((noun) => `${adjective}${noun}`)),
  'Anonymous Viewer', 'First-Time Chatter', 'Just Passing By', 'Longtime Lurker', 'Someone From Chat',
];
