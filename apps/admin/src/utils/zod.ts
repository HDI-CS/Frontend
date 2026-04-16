import { z } from 'zod';

/**
 * Zod 에러를 상세하게 로깅하는 유틸 함수
 */
export function logZodError(
  error: unknown,
  context: {
    operation: string;
    data?: unknown;
    additionalInfo?: Record<string, unknown>;
  }
): void {
  console.error(`${context.operation} schema validation failed:`, error);

  if (error instanceof z.ZodError) {
    console.error(
      'Zod validation errors:',
      error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
        received: 'received' in err ? err.received : undefined,
      }))
    );
  }

  if (context.data) {
    console.error('Raw data:', JSON.stringify(context.data, null, 2));
  }

  if (context.additionalInfo) {
    console.error('Additional context:', context.additionalInfo);
  }
}

/**
 * 안전한 Zod 파싱을 수행하고 에러를 자동으로 로깅하는 유틸 함수
 */
export function safeZodParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: {
    operation: string;
    additionalInfo?: Record<string, unknown>;
  }
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    logZodError(error, {
      operation: context.operation,
      data,
      additionalInfo: context.additionalInfo,
    });
    throw error;
  }
}

/**
 * 데이터 구조를 분석하는 유틸 함수
 */
export function analyzeDataStructure(data: unknown): Record<string, string> {
  if (!data || typeof data !== 'object') {
    return { type: typeof data };
  }

  return Object.keys(data).reduce(
    (acc, key) => {
      acc[key] = typeof (data as Record<string, unknown>)[key];
      return acc;
    },
    {} as Record<string, string>
  );
}
