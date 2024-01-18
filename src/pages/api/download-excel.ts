// pages/api/download-excel.ts

import { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from "exceljs";
import { Readable } from "stream";
// import { getSomeData } from './your-data-fetching-module'; // Модуль для получения данных

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let filename = "example.xlsx";
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Sheet 1");
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
    { id: 2, name: "Alice Smith", email: "alice@example.com", age: 28 },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 },
  ];

  // Добавление данных в лист
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Отправка файла клиенту
  res.setHeader("Content-Disposition", (filename = "${filename}"));
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  stream.pipe(res);
}
