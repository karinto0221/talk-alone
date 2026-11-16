import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEnglishAssociationPrompt, createEnglishCombinationPrompt } from './english-analogy-prompt.data';

describe('English reflex prompt generators', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an association from the expanded independent lists', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    expect(createEnglishAssociationPrompt()).toMatchObject({
      kind: 'intensity',
      text: 'ridiculously slow',
    });
  });

  it('selects the action and object independently', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99);

    expect(createEnglishCombinationPrompt()).toMatchObject({
      kind: 'object_action',
      text: 'play a piano',
    });
  });

  it('places an optional modifier after the article', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    expect(createEnglishCombinationPrompt()).toMatchObject({
      kind: 'object_action',
      text: 'eat a giant piano',
    });
  });

  it('selects the description adjective and noun independently', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0);

    expect(createEnglishCombinationPrompt()).toMatchObject({
      kind: 'description',
      text: 'distinctive mountain',
    });
  });
});
