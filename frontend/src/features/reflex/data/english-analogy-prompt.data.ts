import type { AnalogyPrompt } from './analogy-prompt.data';

const sample = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
const sampleOptional = <T extends string>(items: readonly T[], emptyProbability: number): T | '' => (
  Math.random() < emptyProbability ? '' : sample(items)
);

const ASSOCIATION_MODIFIERS = [
  'ridiculously', 'unbelievably', 'almost suspiciously', 'absurdly', 'painfully', 'impossibly',
  'shockingly', 'strangely', 'comically', 'frighteningly', 'surprisingly', 'unexpectedly',
  'consistently', 'reliably', 'unusually', 'oddly', 'slightly', 'subtly',
  'barely', 'somewhat', 'suddenly', 'occasionally', 'constantly', 'needlessly',
  'perfectly', 'weirdly', 'quietly', 'noticeably', 'confusingly', 'somehow',
] as const;

const ASSOCIATION_ADJECTIVES = [
  'slow', 'fast', 'expensive', 'cheap', 'bitter', 'sweet', 'spicy', 'sour', 'salty', 'delicious',
  'awful', 'beautiful', 'messy', 'narrow', 'wide', 'long', 'short', 'hard', 'soft', 'quiet',
  'loud', 'old', 'new', 'dazzling', 'dark', 'heavy', 'light', 'cold', 'hot', 'lukewarm',
  'large', 'small', 'distant', 'close', 'thin', 'thick', 'slender', 'bulky', 'deep', 'shallow',
  'strong', 'weak', 'bright', 'round', 'square', 'sharp', 'blunt', 'smelly', 'fragrant', 'smooth',
  'rough', 'fluffy', 'sticky', 'dry', 'damp', 'warm', 'cool', 'scary', 'gentle', 'strict',
  'funny', 'boring', 'fun', 'sad', 'cheerful', 'embarrassing', 'cute', 'stylish', 'tacky', 'suspicious',
  'natural', 'unnatural', 'convenient', 'inconvenient', 'easy', 'difficult', 'complicated', 'simple', 'flashy', 'plain',
  'luxurious', 'modest', 'careful', 'sloppy', 'serious', 'casual', 'clever', 'sneaky', 'quick', 'relaxed',
  'energetic', 'sleepy', 'nostalgic', 'rare', 'ordinary', 'distinctive', 'dangerous', 'safe', 'sturdy', 'fragile',
] as const;

const OBJECTS = [
  'a piano', 'a traffic light', 'a refrigerator', 'Tokyo Tower', 'a classroom', 'a vending machine', 'the Moon', 'a train',
  'a ticket gate', 'Mount Fuji', 'a park', 'a level crossing', 'a bookshelf', 'a Ferris wheel', 'a résumé', 'a smartphone',
  'a school building', 'an alarm clock', 'a textbook', 'an elevator', 'a cloud', 'a gymnasium', 'a rainbow', 'a shopping street',
  'a playground slide', 'the ocean', 'a firework display', 'a radio', 'a sunset', 'a sports day', 'summer vacation', 'a meeting',
  'a typhoon', 'a bullet train', 'a crosswalk', 'thunder', 'Monday', 'a bicycle', 'a school lunch', 'a principal',
  'a sofa', 'a clock',
] as const;

const ACTIONS = [
  'eat', 'wear', 'simmer', 'fold', 'freeze', 'adopt',
  'wash', 'charge', 'plant', 'take home', 'rent', 'deliver',
  'throw', 'bake', 'drink', 'pick up', 'sell', 'buy',
  'ride', 'repair', 'reserve', 'compliment', 'wake up', 'tidy up',
  'polish', 'cut', 'mix', 'decorate', 'carry', 'hide',
  'raise', 'photograph', 'print', 'wrap', 'defrost', 'apply to',
  'interview', 'replace', 'return', 'play',
] as const;

const OBJECT_MODIFIERS = [
  'giant', 'transparent', 'golden', 'flying', 'palm-sized', 'soaking-wet',
  'glowing', 'talking', 'sleeping', 'luxury', 'second-hand', 'cutting-edge',
  'broken-down', 'last remaining', 'fake', 'limited-edition', 'driverless', 'upside-down',
  'frozen', 'impossibly heavy', 'miniature', 'life-sized', 'rainbow-colored', 'jet-black',
  'snow-white', 'translucent', 'musical', 'self-moving', 'rechargeable', 'foldable',
  'edible', 'expired', 'personalized', 'century-old', 'time-traveling', 'found',
  'borrowed', 'industrial', 'one-of-a-kind', 'strangely warm',
] as const;
const OBJECT_MODIFIER_EMPTY_PROBABILITY = 0.55;

const DESCRIPTION_ADJECTIVES = [
  'low', 'tall', 'long', 'short', 'narrow', 'wide', 'beautiful', 'dirty',
  'fast', 'slow', 'hard', 'soft', 'quiet', 'loud', 'tiny', 'enormous',
  'bright', 'dark', 'heavy', 'light', 'hot', 'cold', 'thick', 'thin',
  'broad', 'slender', 'deep', 'shallow', 'round', 'square', 'sharp', 'blunt',
  'flashy', 'plain', 'luxurious', 'modest', 'sturdy', 'fragile', 'old', 'new',
  'scary', 'gentle', 'suspicious', 'convenient', 'inconvenient', 'energetic', 'sleepy', 'rare',
  'ordinary', 'distinctive',
] as const;

const DESCRIPTION_NOUNS = [
  'mountain', 'ceiling', 'hurdle', 'voice', 'goal', 'pudding', 'bicycle', 'rice ball', 'bench', 'hat',
  'meeting', 'hallway', 'introduction', 'traffic light', 'preamble', 'movie', 'summer vacation', 'escalator', 'lunch break', 'letter',
  'room', 'park', 'ticket gate', 'sidewalk', 'stage', 'entryway', 'desk', 'balcony', 'bookshelf', 'bike rack',
  'person', 'handwriting', 'bedhead', 'receipt', 'puddle', 'sky', 'snowman', 'mirror', 'white shirt', 'cloud',
  'walk', 'nap', 'meal', 'elevator', 'applause', 'alarm clock', 'text reply', 'roller coaster', 'pillow', 'bread roll',
  'sofa', 'pancake', 'staircase', 'signal', 'school building', 'firework display', 'sports day', 'concert venue', 'construction site', 'shopping street',
  'library', 'snowfall', 'photograph', 'refrigerator', 'Mount Fuji', 'gymnasium', 'Ferris wheel', 'airport', 'department store', 'eraser',
  'eye drop', 'sticky note', 'candy', 'earbud',
  'station', 'tunnel', 'bridge', 'road', 'intersection', 'bus stop', 'parking lot', 'rooftop', 'basement', 'kitchen',
  'bathroom', 'window', 'door', 'curtain', 'rug', 'microwave', 'washing machine', 'vacuum cleaner', 'electric fan', 'air conditioner',
  'television', 'remote control', 'smartphone', 'computer', 'keyboard', 'mouse', 'pencil', 'notebook', 'textbook', 'dictionary',
  'blackboard', 'backpack', 'umbrella', 'shoe', 'sock', 'T-shirt', 'coat', 'glasses', 'wristwatch', 'cup',
  'plate', 'chopsticks', 'spoon', 'pot', 'frying pan', 'kitchen knife', 'toast', 'curry', 'ramen', 'sushi',
  'cake', 'ice cream', 'apple', 'banana', 'tomato', 'radish', 'dog', 'cat', 'panda', 'penguin',
  'giraffe', 'elephant', 'crow', 'goldfish', 'beetle', 'Sun', 'Moon', 'star', 'rainbow', 'wind',
  'rain', 'typhoon', 'thunder', 'desert', 'spaceship', 'robot', 'dream', 'shadow', 'day off', 'homework',
] as const;

const DESCRIPTION_MODIFIERS = [
  'extremely', 'unusually', 'surprisingly', 'oddly', 'strangely', 'unbelievably',
  'exceptionally', 'remarkably', 'slightly', 'almost impossibly', 'somehow', 'consistently',
  'suddenly', 'needlessly', 'perfectly', 'subtly', 'overwhelmingly', 'ridiculously',
  'noticeably', 'suspiciously', 'absurdly', 'painfully', 'unexpectedly', 'confusingly',
  'constantly', 'occasionally', 'quietly', 'wildly', 'barely', 'almost comically',
  'mysteriously', 'genuinely', 'weirdly', 'impressively', 'alarmingly', 'deceptively',
  'unnecessarily', 'outrageously', 'incredibly', 'borderline',
] as const;
const DESCRIPTION_MODIFIER_EMPTY_PROBABILITY = 0.55;

export const ENGLISH_ANALOGY_PROMPT_SOURCE_COUNTS = {
  associationModifiers: ASSOCIATION_MODIFIERS.length,
  associationAdjectives: ASSOCIATION_ADJECTIVES.length,
  objects: OBJECTS.length,
  actions: ACTIONS.length,
  objectModifiers: OBJECT_MODIFIERS.length,
  descriptionAdjectives: DESCRIPTION_ADJECTIVES.length,
  descriptionNouns: DESCRIPTION_NOUNS.length,
  descriptionModifiers: DESCRIPTION_MODIFIERS.length,
} as const;

export const ENGLISH_ANALOGY_PROMPT_VARIATION_COUNT =
  ASSOCIATION_MODIFIERS.length * ASSOCIATION_ADJECTIVES.length
  + OBJECTS.length * ACTIONS.length * (OBJECT_MODIFIERS.length + 1)
  + DESCRIPTION_ADJECTIVES.length * DESCRIPTION_NOUNS.length * (DESCRIPTION_MODIFIERS.length + 1);

const addObjectModifier = (object: string, modifier: string) => {
  if (!modifier) return object;
  const articleMatch = object.match(/^(a|an|the) (.+)$/);
  return articleMatch ? `${articleMatch[1]} ${modifier} ${articleMatch[2]}` : `${modifier} ${object}`;
};

function createIntensityPrompt(): AnalogyPrompt {
  return { kind: 'intensity', label: 'Make a quick association', text: `${sample(ASSOCIATION_MODIFIERS)} ${sample(ASSOCIATION_ADJECTIVES)}` };
}

function createObjectActionPrompt(): AnalogyPrompt {
  const object = sample(OBJECTS);
  const modifier = sampleOptional(OBJECT_MODIFIERS, OBJECT_MODIFIER_EMPTY_PROBABILITY);
  return { kind: 'object_action', label: 'Come back at the action', text: `${sample(ACTIONS)} ${addObjectModifier(object, modifier)}` };
}

function createDescriptionPrompt(): AnalogyPrompt {
  const modifier = sampleOptional(DESCRIPTION_MODIFIERS, DESCRIPTION_MODIFIER_EMPTY_PROBABILITY);
  return { kind: 'description', label: 'Come back at the mash-up', text: [modifier, sample(DESCRIPTION_ADJECTIVES), sample(DESCRIPTION_NOUNS)].filter(Boolean).join(' ') };
}

const COMBINATION_CREATORS = [createObjectActionPrompt, createDescriptionPrompt] as const;

export function createEnglishAssociationPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = createIntensityPrompt();
    if (prompt.text !== previousText) return prompt;
  }
  return createIntensityPrompt();
}

export function createEnglishCombinationPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = sample(COMBINATION_CREATORS)();
    if (prompt.text !== previousText) return prompt;
  }
  return createObjectActionPrompt();
}
