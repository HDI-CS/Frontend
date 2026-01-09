import { expertQueryKeys } from '@/src/queries/expertQuery';
import { UserType } from '@/src/schemas/auth';
import { CreateExpertMember } from '@/src/schemas/expert';
import { createExpertProfile } from '@/src/services/expert/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useCreateExpert = (type: UserType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateExpertMember) => createExpertProfile(type, body),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: expertQueryKeys.listByType(type!),
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 400:
            alert('이미 존재하는 이메일입니다.');
            break;

          default:
            console.error(
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            );
            break;
        }
        return;
      }

      // axios 외 예외
      console.error('알 수 없는 오류가 발생했습니다.');
    },
  });
};
