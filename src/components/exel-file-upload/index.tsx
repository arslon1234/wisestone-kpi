import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      onUpload(uploadedFile);
    }
  };

//   const readExcelFile = (file: File) => {
//     const reader = new FileReader();
//     reader.readAsBinaryString(file);
//     reader.onload = (event) => {
//       const binaryStr = event.target?.result as string;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet);
//     };
//      // JSON formatidagi ma'lumotni tashqariga uzatish
//   };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {file && <p>Yuklangan fayl: {file.name}</p>}
    </div>
  );
};

export default ExcelUploader;
