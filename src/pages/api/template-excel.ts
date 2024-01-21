import { NextApiRequest, NextApiResponse } from "next";
import xlsx from "xlsx";
import fs from "fs";

interface DataInf {
  [key: string]: string;
}
const headersMachine = [
  { id: "createdAt", translate: "Дата" },
  { id: "concentration", translate: "Концентрация, %" },
  { id: "ph", translate: "рН" },
  { id: "conductivity", translate: "Электропроводность, µS/cm" },
  { id: "emulsionLevel", translate: "Уровень эмульсии в баке, л" },
  { id: "addedOilAmount", translate: "Долив (л)" },
  { id: "foaming", translate: "Пенообразование" },
  { id: "smell", translate: "Запах" },
  { id: "fungi", translate: "Грибы" },
  { id: "presenceImpurities", translate: "Наличие посторонних примесей" },
  { id: "fungicide", translate: "Фунгицид" },
  { id: "biocide", translate: "Биоцид" },
  { id: "defoamer", translate: "Пеногаситель" },
  { id: "notesRecommendations", translate: "Примечания и рекомендации" },
  { id: "serviceAdditives", translate: "Добавлено сервисных присадок" },
  { id: "batchNumber", translate: "Номер партии СОЖ" },
];

const headers = [
  "№П/п",
  "Тип",
  "модель",
  "инвентарный номер оборудования",
  "Название СОЖ",
  "Рекомендуемая концентрация",
  "Дата внесения последних показателей",
  "Концентрация %",
  "рН",
  "Электропроводность, µS/cm",
  "Уровень эмульсии в баке, л",
  "Долив (л)",
  "Пенообразование",
  "Запах",
  "Грибы",
  "Наличие посторонних примесей",
  "Добавлено сервисных присадок",
  "Примечания и рекомендации",
  "Номер партии СОЖ",
  "Фунгицид",
  "Биоцид",
  "Пеногаситель",
];

const templateFilePath = "./src/assets/template-report-department.xlsx"; // Укажите путь к вашему шаблону XLSX
const rows = [
  {
    name: "companyName",
    id: 1,
  },
  {
    name: "adress",
    id: 2,
  },
  {
    name: "departmentName",
    id: 3,
  },
  {
    name: "responsiblePerson",
    id: 4,
  },
  {
    name: "name",
    id: 5,
  },
  {
    name: "position",
    id: 6,
  },
]; // id = Номер строки, в которой вы хотите установить значение
const ColumnInf = "D"; // Буквенное обозначение столбца, в котором вы хотите установить значение
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const parseBody = await JSON.parse(req.body);
      const dataInf: DataInf = parseBody.data;

      const indicators = parseBody.indicators;
      // Загрузка шаблона XLSX
      const templateFile = fs.readFileSync(templateFilePath);
      const workbook = xlsx.read(templateFile, { type: "buffer" });

      // Получение нужного листа из книги (например, первый лист)
      const sheetName = workbook.SheetNames[0];
      const ws = workbook.Sheets[sheetName];

      // проходимся по массиву строк и вставляем туда значения относительно объекта по имени ключа
      rows.forEach((row) => {
        const adressCell = ColumnInf + row.id;
        if (!ws[adressCell]) {
          ws[adressCell] = { v: "" }; // Если ячейка пуста, устанавливаем пустое значение
        }

        // Обращение к нужной ячейке и установка значения
        ws[adressCell].v = dataInf[row.name];
      });

      const additionalData = [
        { name: "John", age: 30, city: "New York" },
        { name: "Alice", age: 28, city: "San Francisco" },
        { name: "aasd", age: 28, city: "San dsds" },
      ];

      // Начать заполнение с 19 строки
      let currentRow = 19;
      let currentColumn = "A";

      // Перебор вашего массива данных и запись в ячейки соответствующих данных
      indicators.forEach((itemData: any) => {
        headersMachine.forEach((headerMachine) => {
          if (!ws[currentColumn + currentRow]) {
            ws[currentColumn + currentRow] = { v: "" }; // Если ячейка пуста, устанавливаем пустое значение
          }

          ws[currentColumn + currentRow].v = itemData[headerMachine.id]; // Установка значения в ячейку
          currentColumn = String.fromCharCode(currentColumn.charCodeAt(0) + 1); // Переходим к следующему столбцу
        });
        currentColumn = "A"; // Сбрасываем текущий столбец обратно в "A" для следующей строки
        currentRow++; // Переход к следующей строке
      });

      const redFontStyle = {
        font: { color: { rgb: "FF0000" } }, // 'FF0000' это код красного цвета
      };

      // Применяем стиль к каждой ячейке
      for (const cellAddress in ws) {
        if (cellAddress === "!ref" || !ws[cellAddress] || !ws[cellAddress].v)
          continue; // пропускаем пустые ячейки
        ws[cellAddress].s = redFontStyle; // Устанавливаем стиль красного цвета текста
      }

      // Создание буфера с обновленными данными
      const excelBuffer = xlsx.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      // Отправка файла обратно клиенту для скачивания
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=updatedFile.xlsx"
      );
      res.status(200).end(excelBuffer);
    } else {
      res.status(400).json({ message: "Invalid request method" });
    }
  } catch {
    res.status(500);
  }
}
