/**
 * Quiz-definition schema — recap quiz authored per chapter.
 *
 * @remarks
 * A recap quiz is 2–3 questions asked at the end of a chapter to encourage
 * memorization. State is entirely local and resets on reload; there is no
 * scoring persistence. `explanation` renders after the user commits an
 * answer.
 *
 * `select: "single"` uses a RAC RadioGroup (one correct answer);
 * `select: "multi"` uses a RAC CheckboxGroup (all correct answers must
 * be picked). Both surface the same explanation panel post-commit.
 *
 * @public
 */
import { type } from "arktype";

const QuizChoiceSchema = type({
  id: "string >= 1",
  label: "string >= 1",
  correct: "boolean",
});

const QuizQuestionSchema = type({
  id: "string >= 1",
  prompt: "string >= 1",
  select: "'single' | 'multi'",
  choices: QuizChoiceSchema.array().atLeastLength(2),
  explanation: "string >= 1",
});

export const QuizDefinitionSchema = type({
  id: "string >= 1",
  chapterId: "string >= 1",
  title: "string >= 1",
  questions: QuizQuestionSchema.array().atLeastLength(2).atMostLength(3),
});

export type QuizChoice = typeof QuizChoiceSchema.infer;
export type QuizQuestion = typeof QuizQuestionSchema.infer;
export type QuizDefinition = typeof QuizDefinitionSchema.infer;
