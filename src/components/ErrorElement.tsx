import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RouteError {
   status?: number;
   statusText?: string;
   message?: string;
   data?: any;
   error?: Error;
}

export function ErrorElement() {
   const error = useRouteError() as RouteError;
   const navigate = useNavigate();

   const handleRetry = () => {
      window.location.reload();
   };

   const handleGoHome = () => {
      navigate('/');
   };

   const getErrorMessage = () => {
      if (error?.status === 404) {
         return {
            title: '페이지를 찾을 수 없습니다',
            description: '요청하신 페이지가 존재하지 않습니다.',
         };
      }

      if (error?.status === 500) {
         return {
            title: '서버 오류가 발생했습니다',
            description: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
         };
      }

      return {
         title: '문제가 발생했습니다',
         description: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };
   };

   const { title, description } = getErrorMessage();
   const isDevelopment = process.env.NODE_ENV === 'development';

   return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
         <Card className="w-full max-w-md">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
               </div>
               <CardTitle className="text-2xl">
                  {error?.status && `${error.status} - `}
                  {title}
               </CardTitle>
               <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {isDevelopment && (
                  <div className="rounded-md bg-red-50 p-3 border border-red-200">
                     <p className="text-sm font-medium text-red-800 mb-2">개발 모드 에러 정보:</p>
                     <div className="space-y-1 text-xs text-red-700">
                        {error?.status && (
                           <p>
                              <strong>Status:</strong> {error.status}
                           </p>
                        )}
                        {error?.statusText && (
                           <p>
                              <strong>Status Text:</strong> {error.statusText}
                           </p>
                        )}
                        {error?.message && (
                           <p>
                              <strong>Message:</strong> {error.message}
                           </p>
                        )}
                        {error?.error?.message && (
                           <p>
                              <strong>Error:</strong> {error.error.message}
                           </p>
                        )}
                        {error?.error?.stack && (
                           <details className="mt-2">
                              <summary className="cursor-pointer text-red-600 hover:text-red-800">
                                 스택 트레이스 보기
                              </summary>
                              <pre className="mt-1 whitespace-pre-wrap overflow-auto max-h-32 text-xs">
                                 {error.error.stack}
                              </pre>
                           </details>
                        )}
                     </div>
                  </div>
               )}

               <div className="flex flex-col gap-2">
                  <Button onClick={handleRetry} className="w-full">
                     <RefreshCw className="mr-2 h-4 w-4" />
                     다시 시도
                  </Button>
                  <Button variant="outline" onClick={handleGoHome} className="w-full">
                     <Home className="mr-2 h-4 w-4" />
                     홈으로 이동
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
