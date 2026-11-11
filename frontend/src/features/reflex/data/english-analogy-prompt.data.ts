import type { AnalogyPrompt } from './analogy-prompt.data';

const sample = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

const INTENSIFIERS = ['ridiculously', 'unbelievably', 'almost suspiciously', 'absurdly', 'painfully', 'impossibly', 'shockingly', 'strangely', 'comically', 'frighteningly'] as const;
const ADJECTIVES = ['slow', 'fast', 'expensive', 'cheap', 'bitter', 'sweet', 'spicy', 'beautiful', 'messy', 'narrow', 'wide', 'long', 'short', 'hard', 'soft', 'quiet', 'loud', 'old', 'bright', 'dark', 'heavy', 'light', 'cold', 'hot', 'large', 'small', 'far away', 'close', 'thin', 'awkward'] as const;

const OBJECTS_BY_ACTION = {
  eat: ['a piano', 'a traffic light', 'a refrigerator', 'a classroom', 'a vending machine', 'the Moon', 'a train', 'a bookshelf'],
  wear: ['a refrigerator', 'a mountain', 'a piano', 'a park bench', 'a level crossing', 'a bookshelf', 'a Ferris wheel', 'a bus stop'],
  boil: ['a résumé', 'a smartphone', 'a school building', 'an alarm clock', 'a traffic light', 'a textbook', 'an elevator', 'a cloud'],
  fold: ['a mountain', 'a train', 'a gymnasium', 'a rainbow', 'a shopping street', 'a Ferris wheel', 'the ocean', 'a lighthouse'],
  freeze: ['a firework display', 'a radio show', 'a sunset', 'a sports day', 'summer vacation', 'a meeting', 'a thunderstorm', 'Monday morning'],
  adopt: ['an elevator', 'a typhoon', 'a bullet train', 'a crosswalk', 'a thunderstorm', 'a vending machine', 'Monday', 'a refrigerator'],
  wash: ['a piano', 'a tower', 'a classroom', 'a public park', 'a résumé', 'a traffic light', 'a bicycle', 'a cloud'],
  charge: ['a mountain', 'a school lunch', 'a gymnasium', 'a sunset', 'a Ferris wheel', 'the ocean', 'a staircase', 'a sandwich'],
  plant: ['a refrigerator', 'a train', 'a piano', 'a vending machine', 'a traffic light', 'a sofa', 'an elevator', 'a clock'],
  deliver: ['a mountain', 'a sports day', 'a Ferris wheel', 'a gymnasium', 'a rainbow', 'summer vacation', 'a tower', 'the horizon'],
  rent: ['a hurricane', 'a school building', 'a sunset', 'the ocean', 'a cloud', 'Monday', 'a roundabout', 'an airport'],
  interview: ['a staircase', 'a sandwich', 'a traffic cone', 'a thunderstorm', 'a mirror', 'a suitcase', 'a cactus', 'the Sun'],
} as const;

const DESCRIPTIONS = [
  ['a very low', ['mountain', 'ceiling', 'hurdle', 'voice', 'goal']],
  ['an extremely tall', ['pudding', 'bicycle', 'sandwich', 'hat', 'coffee cup']],
  ['an unusually long', ['meeting', 'hallway', 'introduction', 'traffic light', 'elevator ride']],
  ['a surprisingly short', ['movie', 'vacation', 'escalator', 'lunch break', 'letter']],
  ['a painfully narrow', ['room', 'park', 'ticket gate', 'sidewalk', 'stage']],
  ['a strangely wide', ['front door', 'desk', 'balcony', 'bookshelf', 'bike rack']],
  ['a beautiful', ['stranger', 'handwritten note', 'bedhead', 'receipt', 'puddle']],
  ['a very dirty', ['sky', 'snowman', 'mirror', 'white shirt', 'cloud']],
  ['an incredibly fast', ['walk', 'nap', 'meeting', 'dinner', 'elevator']],
  ['an unbelievably slow', ['round of applause', 'escalator', 'alarm clock', 'text reply', 'roller coaster']],
  ['a rock-hard', ['pudding', 'pillow', 'bread roll', 'sofa', 'pancake']],
  ['an oddly soft', ['desk', 'staircase', 'traffic light', 'bicycle', 'school building']],
  ['a silent', ['firework display', 'sports day', 'concert venue', 'construction site', 'shopping street']],
  ['a deafening', ['library', 'snowfall', 'letter', 'photograph', 'refrigerator']],
  ['a tiny', ['mountain', 'gymnasium', 'Ferris wheel', 'airport', 'department store']],
  ['an enormous', ['eraser', 'eye drop', 'sticky note', 'candy', 'earbud']],
] as const;

function createIntensityPrompt(): AnalogyPrompt {
  return { kind: 'intensity', label: 'Make a comparison', text: `${sample(INTENSIFIERS)} ${sample(ADJECTIVES)}` };
}

function createObjectActionPrompt(): AnalogyPrompt {
  const actions = Object.keys(OBJECTS_BY_ACTION) as Array<keyof typeof OBJECTS_BY_ACTION>;
  const action = sample(actions);
  return { kind: 'object_action', label: 'Respond to the absurd request', text: `${action} ${sample(OBJECTS_BY_ACTION[action])}` };
}

function createDescriptionPrompt(): AnalogyPrompt {
  const [description, nouns] = sample(DESCRIPTIONS);
  return { kind: 'description', label: 'Name a fitting example', text: `${description} ${sample(nouns)}` };
}

const CREATORS = [createIntensityPrompt, createObjectActionPrompt, createDescriptionPrompt] as const;

export function createEnglishAnalogyPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = sample(CREATORS)();
    if (prompt.text !== previousText) return prompt;
  }
  return createObjectActionPrompt();
}
