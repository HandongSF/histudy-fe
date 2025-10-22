import * as xlsx from 'xlsx';

export function buildWorkBook<T>(sheetData: T[]) {
   const workBook = xlsx.utils.book_new();
   const workSheet = xlsx.utils.json_to_sheet(sheetData);

   xlsx.utils.book_append_sheet(workBook, workSheet);

   return workBook;
}

export function downloadExcel(data: xlsx.WorkBook, filename: string) {
   xlsx.writeFile(data, filename);
}
