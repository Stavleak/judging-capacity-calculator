import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate } from './calculate.mjs';

const input = { projects: 100, reviewsPerProject: 3, reviewMinutes: 8, judges: 12, availableMinutes: 180, usableFraction: 0.75 };
test('100 submissions require 19 judges when complete reviews must fit', () => {
  const output = calculate(input);
  assert.equal(output.totalReviews, 300);
  assert.equal(output.requiredJudgeMinutes, 2400);
  assert.equal(output.minimumJudgesByTotalTime, 18);
  assert.equal(output.minimumJudgesByWholeReviews, 19);
  assert.equal(output.maximumProjects, 64);
  assert.equal(output.arithmeticFeasible, false);
  assert.equal(calculate({ ...input, judges: 19 }).arithmeticFeasible, true);
});
test('one review longer than the entire usable window cannot be scheduled', () => {
  const output = calculate({ ...input, reviewMinutes: 140 });
  assert.equal(output.reviewsPerJudge, 0);
  assert.equal(output.minimumJudgesByWholeReviews, null);
  assert.equal(output.arithmeticFeasible, false);
});
test('refuses impossible distinct judge count and malformed data', () => {
  for (const invalid of [null, [], { ...input, projects: -1 }, { ...input, judges: 2 },
    { ...input, projects: 1.2 }, { ...input, usableFraction: 0 }, { ...input, reviewMinutes: NaN },
    { ...input, extra: true }, { ...input, availableMinutes: Infinity },
    { ...input, projects: Number.MAX_SAFE_INTEGER }]) assert.throws(() => calculate(invalid));
});
test('validates exact window boundary without rounding a partial review up', () => {
  const output = calculate({ projects: 2, reviewsPerProject: 1, reviewMinutes: 7,
    judges: 1, availableMinutes: 14, usableFraction: 1 });
  assert.equal(output.arithmeticFeasible, true);
  assert.equal(calculate({ projects: 2, reviewsPerProject: 1, reviewMinutes: 7,
    judges: 1, availableMinutes: 13, usableFraction: 1 }).arithmeticFeasible, false);
});
