import { cn } from '@/lib/utils';
import { getSemesterLabel } from '@/utils/semester';
import { useHIStateValue } from '@/hooks/HIState';
import { currentSemesterState } from '@/store/HISAtom';

export function CurrentSemester() {
   const currentSemester = useHIStateValue(currentSemesterState);

   if (!currentSemester) {
      return null;
   }

   return (
      <div className={cn('px-2 rounded-lg')}>
         <div className="flex items-center gap-2 font-medium group-data-[collapsible=icon]:hidden min-w-36">
            {currentSemester.year}학년도 {getSemesterLabel(currentSemester.semester)}
         </div>
      </div>
   );
}
