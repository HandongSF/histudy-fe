export function formatTimeToHoursAndMinutes(minutes: number) {
   const hours = Math.floor(minutes / 60);
   const mins = minutes % 60;
   return `${hours}시간 ${mins}분`;
}
