import { NextApiRequest, NextApiResponse } from "next";
import { Workbook, Worksheet } from "exceljs";
import stream from "stream";
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

const columnNameInf = "D";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workbook = new Workbook();
  const filePath = "./src/assets/template-report-department.xlsx"; // Укажите путь к вашему шаблону XLSX

  try {
    if (req.method === "POST") {
      const parseBody = await JSON.parse(req.body);

      const indicators = parseBody.indicators;
      const dataInf: DataInf = parseBody.data;

      const fetchedWorkbook = await workbook.xlsx.readFile(filePath);
      let worksheet: Worksheet | undefined = fetchedWorkbook.getWorksheet(
        "По конкретному станку"
      );

      if (worksheet) {
        // Установка значений и стиля

        rows.forEach((row) => {
          const adressCell = columnNameInf + row.id;
          // if (!worksheet.getCell(adressCell)) {
          //   worksheet.getCell(adressCell).value = { v: "" }; // Если ячейка пуста, устанавливаем пустое значение
          // }

          // Обращение к нужной ячейке и установка значения
          worksheet.getCell(adressCell).value = dataInf[row.name];
        });

        // Начать заполнение с 19 строки
        let currentRow = 19;
        let currentColumn = "A";

        // Перебор вашего массива данных и запись в ячейки соответствующих данных
        indicators.forEach((itemData: any) => {
          headersMachine.forEach((headerMachine) => {
            // if (!worksheet.getCell(currentColumn + currentRow)) {
            //   worksheet.getCell(currentColumn + currentRow] = { v: "" }; // Если ячейка пуста, устанавливаем пустое значение
            // }

            worksheet.getCell(currentColumn + currentRow).value =
              itemData[headerMachine.id]; // Установка значения в ячейку
            worksheet.getCell(currentColumn + currentRow).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            worksheet.getCell(currentColumn + currentRow).alignment = {
              horizontal: "center",
            }; // Устанавливаем текст по центру
            worksheet.getCell(currentColumn + currentRow).font = { size: 11 }; //

            if (itemData && itemData[headerMachine.id]?.length >= 7) {
              worksheet.getColumn(currentColumn).width = 20;
            }

            currentColumn = String.fromCharCode(
              currentColumn.charCodeAt(0) + 1
            ); // Переходим к следующему столбцу
          });
          currentColumn = "A"; // Сбрасываем текущий столбец обратно в "A" для следующей строки
          currentRow++; // Переход к следующей строке
        });

        // Отправка файла обратно клиенту для скачивания
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=outputFile.xlsx"
        );

        // Преобразование рабочей книги в поток и отправка его клиенту
        const buffer = await fetchedWorkbook.xlsx.writeBuffer();

        const streamBuffer = Buffer.from(buffer);
        const readStream = new stream.PassThrough();
        readStream.end(streamBuffer);

        readStream.pipe(res);
      } else {
        throw new Error("Worksheet not found");
      }
    } else {
      res.status(500);
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
    res.status(500).send("Произошла ошибка при генерации файла");
  }
}
