import * as xlsx from 'xlsx';

export function downloadExcelFromSheetData<T>(sheetData: T[], filename: string) {
   const workBook = buildWorkBook(sheetData);
   xlsx.writeFile(workBook, filename);

   function buildWorkBook<T>(sheetData: T[]) {
      const workBook = xlsx.utils.book_new();

      const workSheet = xlsx.utils.json_to_sheet(sheetData);

      xlsx.utils.book_append_sheet(workBook, workSheet);

      return workBook;
   }
}
