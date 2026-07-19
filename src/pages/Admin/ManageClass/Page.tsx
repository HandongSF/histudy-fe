import { deleteCourse, searchCourses } from '@/apis/course';
import SpinnerLoading from '@/components/SpinnerLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Course } from '@/interface/course';
import { Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import ClassRegisterButton from './components/ClassRegisterButton';

export default function ManageClassPage() {
   const [searchTerm, setSearchTerm] = useState('');

   const [debouncedSearchTerm] = useDebounce(searchTerm, 200);

   const { data, refetch } = useQuery(['searchCourse', debouncedSearchTerm], () => searchCourses(debouncedSearchTerm));
   const { mutateAsync: removeCourse, isLoading: isDeleting } = useMutation(deleteCourse);

   const courses = useMemo(() => {
      if (!data) return [];
      return data.courses;
   }, [data]);

   const handleDelete = async (course: Course) => {
      const shouldDelete = window.confirm(`${course.name} (${course.code}) 수업을 삭제하시겠습니까?`);
      if (!shouldDelete) return;

      try {
         await removeCourse(course.id);
         toast.success('수업이 삭제되었습니다.');
      } catch {
         toast.error('수업 삭제에 실패했습니다.');
         return;
      }

      try {
         await refetch({ throwOnError: true });
      } catch {
         toast.error('수업 목록 갱신에 실패했습니다. 새로고침해 주세요.');
      }
   };

   return (
      <div className="container mx-auto p-4 md:p-8  space-y-8">
         <div className="flex justify-between items-center mb-6 ">
            <h1 className="text-2xl font-semibold">등록된 수업 목록</h1>
            <ClassRegisterButton refetch={refetch} />
         </div>

         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
               type="text"
               placeholder="과목명 검색"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
            />
         </div>

         <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[35%] px-4 py-3 text-left text-sm font-medium">과목명</TableHead>
                     <TableHead className="w-[25%] px-4 py-3 text-left text-sm font-medium">과목코드</TableHead>
                     <TableHead className="w-[25%] px-4 py-3 text-left text-sm font-medium">담당 교수</TableHead>
                     <TableHead className="w-[15%] px-4 py-3 text-right text-sm font-medium">관리</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {courses.length > 0 ? (
                     courses.map((course) => (
                        <TableRow key={course.id}>
                           <TableCell className="px-4 py-3 text-sm">{course.name}</TableCell>
                           <TableCell className="px-4 py-3 text-sm">{course.code}</TableCell>
                           <TableCell className="px-4 py-3 text-sm">{course.prof}</TableCell>
                           <TableCell className="px-4 py-3 text-right">
                              <Button
                                 type="button"
                                 variant="destructive"
                                 size="sm"
                                 aria-label={`${course.name} 삭제`}
                                 disabled={isDeleting}
                                 onClick={() => handleDelete(course)}
                              >
                                 <Trash2 className="h-4 w-4" />
                                 삭제
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                           등록된 수업이 없습니다.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
