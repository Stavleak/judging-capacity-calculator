import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const keys = ['projects', 'reviewsPerProject', 'reviewMinutes', 'judges', 'availableMinutes', 'usableFraction'];

export function calculate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object / Нужен объект');
  if (Object.keys(input).some((key) => !keys.includes(key))) throw new Error('Unknown input field / Неизвестное поле');
  for (const key of keys) {
    if (!Number.isFinite(input[key])) throw new Error(`Invalid number / Некорректное число: ${key}`);
  }
  for (const key of ['projects', 'reviewsPerProject', 'judges']) {
    if (!Number.isSafeInteger(input[key]) || input[key] < 1) throw new Error(`Expected a positive safe integer / Нужное целое число: ${key}`);
  }
  if (input.reviewsPerProject > input.judges) throw new Error('Reviews require distinct judges / Проверки требуют разных членов жюри');
  if (input.reviewMinutes <= 0 || input.availableMinutes <= 0 || input.usableFraction <= 0 || input.usableFraction > 1) {
    throw new Error('Minutes must be positive; usableFraction must be in (0, 1] / Проверьте минуты и долю времени');
  }
  const totalReviews = input.projects * input.reviewsPerProject;
  const requiredJudgeMinutes = totalReviews * input.reviewMinutes;
  const usableMinutesPerJudge = input.availableMinutes * input.usableFraction;
  const reviewsPerJudge = Math.floor(usableMinutesPerJudge / input.reviewMinutes);
  const minimumJudgesByTotalTime = Math.ceil(requiredJudgeMinutes / usableMinutesPerJudge);
  const minimumJudgesByWholeReviews = reviewsPerJudge === 0 ? null : Math.max(input.reviewsPerProject, Math.ceil(totalReviews / reviewsPerJudge));
  const maximumProjects = Math.floor(input.judges * reviewsPerJudge / input.reviewsPerProject);
  const peakReviewsPerJudge = Math.ceil(totalReviews / input.judges);
  const arithmeticFeasible = reviewsPerJudge > 0 && peakReviewsPerJudge <= reviewsPerJudge;
  const values = [totalReviews, requiredJudgeMinutes, usableMinutesPerJudge, minimumJudgesByTotalTime, maximumProjects];
  if (values.some((value) => !Number.isFinite(value) || value > Number.MAX_SAFE_INTEGER)) {
    throw new Error('Input exceeds safe calculation range / Значения вне безопасного диапазона');
  }
  return { totalReviews, requiredJudgeMinutes, usableMinutesPerJudge, reviewsPerJudge,
    minimumJudgesByTotalTime, minimumJudgesByWholeReviews, maximumProjects,
    peakReviewsPerJudge, arithmeticFeasible, assignmentFeasibility: 'not_checked',
    assumptions: ['Equal review durations', 'Independent parallel reviews', 'No conflict or track constraints checked'] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage / Запуск: node calculate.mjs input.json');
    console.log(JSON.stringify(calculate(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Calculation failed / Ошибка расчёта');
    process.exitCode = 1;
  }
}
