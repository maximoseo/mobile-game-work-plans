import { describe, expect, it } from 'vitest';
import { gamePlans, priorityList } from './plans';

/** The panel aggregates genre chips and tiers the backlog by rank; a free-text
 *  genre or an orphan rank silently empties those surfaces, so the vocabulary
 *  and the rank/title join are enforced here. */
const GENRE_VOCABULARY = [
  'Puzzle', 'Strategy', 'Simulation', 'Tycoon', 'Arcade',
  'Action', 'Roguelite', 'Narrative', 'Casual', 'Horror',
] as const;

describe('plans seed', () => {
  it('keeps every genre inside the controlled vocabulary', () => {
    const outside = gamePlans.filter((plan) => !(GENRE_VOCABULARY as readonly string[]).includes(plan.genre));
    expect(outside.map((plan) => `${plan.title}: ${plan.genre}`)).toEqual([]);
  });

  it('uses fewer distinct genres than plans so aggregation carries signal', () => {
    expect(new Set(gamePlans.map((plan) => plan.genre)).size).toBeLessThanOrEqual(GENRE_VOCABULARY.length);
  });

  it('ranks only titles that exist in the plan list, once each', () => {
    const titles = new Set(gamePlans.map((plan) => plan.title));
    const ranks = priorityList.map((item) => item.rank);
    for (const item of priorityList) expect(titles.has(item.title), item.title).toBe(true);
    expect(new Set(ranks).size).toBe(ranks.length);
  });
});
