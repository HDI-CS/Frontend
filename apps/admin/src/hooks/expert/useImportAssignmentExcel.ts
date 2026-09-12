import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { importMappingExcel } from '@/src/services/expert/mapping';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseImportAssignmentExcelParams {
  type: UserType;
  assessmentRoundId: number;
}

export const useImportAssignmentExcel = ({
  type,
  assessmentRoundId,
}: UseImportAssignmentExcelParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      importMappingExcel({ type, assessmentRoundId, file }),

    onSuccess: async () => {
      // 매칭 결과가 바뀌었으니 목록을 다시 불러온다
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.lists(),
      });
    },
  });
};
