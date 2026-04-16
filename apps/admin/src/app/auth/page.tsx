'use client';

import Image from 'next/image';
import { useState } from 'react';

import { HongikUnivLogo } from '@hdi/ui';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { useLogin } from '@/src/hooks/useLogin';
import { LoginRequest } from '@/src/schemas/auth';

export default function AuthPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const loginMutation = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <Image
        src={HongikUnivLogo}
        alt="홍익대학교 로고"
        width={200}
        className="h-auto object-contain"
        priority
      />
      <form className="w-90 flex flex-col gap-6" onSubmit={handleSubmit}>
        {loginMutation.error && (
          <div className="w-full rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">로그인 실패</span>
            </div>
            <p className="mt-1 text-sm">{loginMutation.error.message}</p>
          </div>
        )}

        {loginMutation.isSuccess && (
          <div className="w-full rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">로그인 성공</span>
            </div>
            <p className="mt-1 text-sm">잠시 후 메인 페이지로 이동합니다...</p>
          </div>
        )}
        <section className="flex w-full flex-col gap-4">
          <Input
            type="email"
            name="email"
            placeholder="이메일 주소를 입력해주세요."
            className="w-full"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            className="w-full"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </section>
        <Button
          text={loginMutation.isPending ? '로그인 중...' : '로그인'}
          onClick={() => {}}
          className="w-full bg-blue-700 py-3.5 text-white disabled:bg-gray-400"
          type="submit"
          disabled={loginMutation.isPending}
        />
      </form>
    </div>
  );
}
