import type { ApiErrorResponse } from '@/interface/api-error';

interface ErrorResponseLike {
   data?: unknown;
   status?: unknown;
   headers?: unknown;
}

interface ApiErrorReference {
   label: '오류 ID' | '요청 ID';
   value: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
   typeof value === 'object' && value !== null && !Array.isArray(value);

const getErrorResponse = (error: unknown): ErrorResponseLike | undefined => {
   if (!isRecord(error) || !isRecord(error.response)) {
      return undefined;
   }

   return error.response as ErrorResponseLike;
};

const getNonBlankString = (value: unknown): string | undefined => {
   if (typeof value !== 'string' || !value.trim()) {
      return undefined;
   }

   return value.trim();
};

const getHeaderValue = (headers: unknown, name: string): string | undefined => {
   if (!isRecord(headers)) {
      return undefined;
   }

   const getHeader = headers.get;
   if (typeof getHeader === 'function') {
      return getNonBlankString(getHeader.call(headers, name));
   }

   const header = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase());
   return getNonBlankString(header?.[1]);
};

export const getApiErrorResponse = (error: unknown): ApiErrorResponse | undefined => {
   const response = getErrorResponse(error);
   if (!isRecord(response?.data)) {
      return undefined;
   }

   return {
      code: typeof response.data.code === 'number' ? response.data.code : undefined,
      error: getNonBlankString(response.data.error),
      message: getNonBlankString(response.data.message),
      requestId: getNonBlankString(response.data.requestId),
      errorId: getNonBlankString(response.data.errorId),
   };
};

const getApiErrorReference = (error: unknown): ApiErrorReference | undefined => {
   const response = getErrorResponse(error);
   const apiError = getApiErrorResponse(error);
   const status = typeof response?.status === 'number' ? response.status : apiError?.code;

   if (typeof status !== 'number' || status < 500) {
      return undefined;
   }

   if (apiError?.errorId) {
      return { label: '오류 ID', value: apiError.errorId };
   }

   const requestId = apiError?.requestId ?? getHeaderValue(response?.headers, 'x-request-id');
   return requestId ? { label: '요청 ID', value: requestId } : undefined;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string =>
   getApiErrorResponse(error)?.message ?? fallback;

export const formatApiErrorMessage = (error: unknown, fallback: string): string => {
   const message = getApiErrorMessage(error, fallback);
   const reference = getApiErrorReference(error);

   return reference ? `${message} (${reference.label}: ${reference.value})` : message;
};
