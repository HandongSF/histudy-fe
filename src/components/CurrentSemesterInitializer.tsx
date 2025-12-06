import { getSemester } from '@/apis/semester';
import { WaveLoading } from '@/components/WaveLoading';
import { useHIStateValue, useSetHiState } from '@/hooks/HIState';
import { currentSemesterState } from '@/store/HISAtom';
import { ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface CurrentSemesterInitializerProps {
   children: ReactNode;
}

export function CurrentSemesterInitializer({ children }: CurrentSemesterInitializerProps) {
   const setCurrentSemester = useSetHiState(currentSemesterState);
   const [isInitialized, setIsInitialized] = useState(false);

   const { data: semesterData } = useQuery(['semester'], getSemester, {
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
   });

   useEffect(() => {
      if (semesterData?.academicTerms && !isInitialized) {
         const current = semesterData.academicTerms.find((term) => term.isCurrent);
         setCurrentSemester(current || null);
         setIsInitialized(true);
      }
   }, [semesterData, setCurrentSemester, isInitialized]);

   if (!isInitialized) {
      return (
         <div className="flex items-center justify-center h-screen">
            <WaveLoading />
         </div>
      );
   }

   return <>{children}</>;
}
