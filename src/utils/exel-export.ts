import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data); // JSON → Excel sheet
  const wb = XLSX.utils.book_new(); // Yangi kitob yaratish
  XLSX.utils.book_append_sheet(wb, ws, "Users Data"); // Sheet qo‘shish

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }); // Faylni yaratish
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

  saveAs(blob, `${fileName}.xlsx`); // Faylni yuklab olish
};
