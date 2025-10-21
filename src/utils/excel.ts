import * as xlsx from 'xlsx';

export function buildWorkBook<T>(sheetData: T[]) {
   const wb = xlsx.utils.book_new();

   const ws = xlsx.utils.json_to_sheet(sheetData);

   xlsx.utils.book_append_sheet(wb, ws);

   return wb;
}

export function downloadExcel(data: xlsx.WorkBook, filename: string) {
   xlsx.writeFile(data, filename);
}
