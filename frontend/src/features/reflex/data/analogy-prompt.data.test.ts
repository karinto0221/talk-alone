import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAssociationPrompt, createCombinationPrompt } from './analogy-prompt.data';

describe('reflex prompt generators', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an association without a context prefix', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.37)
      .mockReturnValueOnce(0);

    expect(createAssociationPrompt()).toMatchObject({
      kind: 'intensity',
      text: '意外と遅い',
    });
  });

  it('selects the object and action independently', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99);

    expect(createCombinationPrompt()).toMatchObject({
      kind: 'object_action',
      text: 'ピアノを演奏する',
    });
  });

  it('selects the description adjective and noun independently', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0);

    expect(createCombinationPrompt()).toMatchObject({
      kind: 'description',
      text: '独特な山',
    });
  });
});
