import { expect, test } from '@playwright/test';

import { formatApiErrorMessage } from '../src/utils/apiError';

const apiError = (data: unknown, status: number, headers: Record<string, string> = {}) => ({
   response: {
      data,
      status,
      headers,
   },
});

test('5xx 오류는 서버 메시지와 errorId를 함께 안내한다', () => {
   // given
   const error = apiError(
      {
         code: 500,
         error: 'Internal Server Error',
         message: '서버 내부 오류가 발생했습니다.',
         requestId: 'request-123',
         errorId: 'error-456',
      },
      500,
   );

   // when
   const message = formatApiErrorMessage(error, '요청에 실패했습니다.');

   // then
   expect(message).toBe('서버 내부 오류가 발생했습니다. (오류 ID: error-456)');
   expect(message).not.toContain('trace');
});

test('4xx 오류는 서버 메시지만 안내하고 requestId를 노출하지 않는다', () => {
   // given
   const error = apiError(
      {
         code: 409,
         error: 'Conflict',
         message: '사용 중인 강의는 삭제할 수 없습니다.',
         requestId: 'request-123',
      },
      409,
   );

   // when
   const message = formatApiErrorMessage(error, '요청에 실패했습니다.');

   // then
   expect(message).toBe('사용 중인 강의는 삭제할 수 없습니다.');
});

test('응답 본문이 없어도 5xx 응답 헤더의 requestId를 안내한다', () => {
   // given
   const error = apiError(undefined, 503, { 'x-request-id': 'request-503' });

   // when
   const message = formatApiErrorMessage(error, '서비스를 잠시 사용할 수 없습니다.');

   // then
   expect(message).toBe('서비스를 잠시 사용할 수 없습니다. (요청 ID: request-503)');
});

test('API 오류가 아니면 안전한 기본 메시지를 반환한다', () => {
   // when
   const message = formatApiErrorMessage(new Error('private implementation detail'), '요청에 실패했습니다.');

   // then
   expect(message).toBe('요청에 실패했습니다.');
});

test('배열 형태 응답은 API 오류로 해석하지 않는다', () => {
   // when
   const message = formatApiErrorMessage(apiError(['private detail'], 500), '요청에 실패했습니다.');

   // then
   expect(message).toBe('요청에 실패했습니다.');
});
