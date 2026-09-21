export type Vocab = {
  id: number;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  translation: string;
};

export type Grammar = {
  id: number;
  title: string;
  level: string;
  explanation: string;
  examples: { korean: string; vietnamese: string }[];
};

export type HangulGroup = { title: string; items: { c: string; say: string; r: string }[] };

export type Progress = {
  learnedWords: number[];
  masteredWords: number[];
  quizCorrect: number;
  quizTotal: number;
  streak: number;
  lastStudyDate: string;
};

export type Question = { prompt: string; audio?: string; options: string[]; answer: string };
