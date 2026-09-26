import { importCourses } from '@/apis/course';
import { Button } from '@/components/ui/button';
import { formatApiErrorMessage } from '@/utils/apiError';
import { useRef } from 'react';
import { toast } from 'sonner';

type Refetch = (options?: { throwOnError?: boolean }) => Promise<unknown> | unknown;

export default function ClassRegisterButton({ refetch }: { refetch: Refetch }) {
   const fileRef = useRef<HTMLInputElement>(null);
   const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const file = event.target.files?.[0];
      if (!file) return;

      try {
         if (!window.confirm('예시 행을 삭제했는지 확인했습니다. 해당 파일을 등록하시겠습니까?')) return;

         const formData = new FormData();
         formData.append('file', file);

         await importCourses(formData);
         toast.success('수업 목록을 성공적으로 불러왔습니다.');

         try {
            await refetch({ throwOnError: true });
         } catch {
            toast.error('수업 목록 갱신에 실패했습니다. 새로고침해 주세요.');
         }
      } catch (error) {
         toast.error(formatApiErrorMessage(error, '수업 목록 업로드에 실패했습니다.'));
      } finally {
         if (fileRef.current) {
            fileRef.current.value = '';
         }
      }
   };

   const handleClick = () => {
      if (!fileRef.current) return;
      fileRef.current.click();
   };
   return (
      <>
         <input
            type="file"
            ref={fileRef}
            hidden
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={handleChange}
         />
         <Button onClick={handleClick}>수업 목록 불러오기</Button>
      </>
   );
}
