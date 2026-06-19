import type { z } from 'zod';
import { EvaluationYearsResponseSchema } from '../schemas/survey';

type Years = z.infer<typeof EvaluationYearsResponseSchema>['result'];

export const getFolderNames = (
  data: Years,
  yearId: number,
  roundId: number
) => {
  const year = data.find((y) => y.yearId === yearId);

  if (!year) {
    return {
      yearFolderName: null,
      roundFolderName: null,
    };
  }

  const round = year.rounds.find((r) => r.roundId === roundId);

  return {
    yearFolderName: year.folderName ?? null,
    roundFolderName: round?.folderName ?? null,
  };
};
