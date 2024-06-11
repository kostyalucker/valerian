import { NextApiRequest, NextApiResponse } from "next";
import { Workbook, Worksheet } from "exceljs";
import stream from "stream";

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 потому что нумерация месяцев начинается с 0
  const day = date.getDate().toString().padStart(2, "0"); // Добавляем ведущий ноль, если нужно
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours + ":" + minutes}`;
};

interface DataInf {
  [key: string]: string;
}
const headersMachine = [
  { id: "elNumber", translate: "№П/п" },
  { id: "type", translate: "Тип" },
  { id: "oilName", translate: "Название СОЖ" },
  { id: "recommendeConcentration", translate: "Рекомендуемая концетрация" },
  { id: "updatedAt", translate: "Дата внесения последних показателей" },
  { id: "concentration", translate: "Концетрация" },
  { id: "ph", translate: "PH" },
  { id: "conductivity", translate: "Электропроводность" },
  { id: "emulsionLevel", translate: "Уровень эмульсии" },
  { id: "addedOilAmount", translate: "Долив/Л" },
  { id: "foaming", translate: "Пенообразование" },
  { id: "smell", translate: "Запах" },
  { id: "fungi", translate: "Грибы" },
  { id: "presenceImpurities", translate: "Наличие посторонних примесей" },
  { id: "fungicide", translate: "Фунгицид" },
  { id: "biocide", translate: "Биоцид" },
  { id: "antiFoamAdditive", translate: "Пеногаситель" },
  { id: "notesRecommendations", translate: "Примечания и рекомендации" },
  { id: "batchNumberDate", translate: "Номер партии СОЖ" },
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
    name: "name",
    id: 5,
  },
  {
    name: "position",
    id: 6,
  },
]; // id = Номер строки, в которой вы хотите установить значение

const columnNameInf = "D";
const columnGeneralInformations = "M";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workbook = new Workbook();
  const filePath = "./src/assets/templateGeneralReport.xlsx"; // Укажите путь к вашему шаблону XLSX

  try {
    if (req.method === "POST") {
      const parseBody = await JSON.parse(req.body);

      const indicators = parseBody.indicators;
      const dataInf: DataInf = parseBody.data;
      const fetchedWorkbook = await workbook.xlsx.readFile(filePath);
      let worksheet: Worksheet | undefined =
        fetchedWorkbook.getWorksheet("Общий по цеху");

      if (worksheet) {
        // Установка значений и стиля

        rows.forEach((row) => {
          const adressCell = columnNameInf + row.id;
          // Обращение к нужной ячейке и установка значения
          worksheet.getCell(adressCell).value = dataInf[row.name];
        });

        // Начать заполнение с 19 строки
        let currentRow = 19;
        let currentColumn = "A";

        // Перебор вашего массива данных и запись в ячейки соответствующих данных
        indicators.forEach((itemData: any) => {
          const fieldType =
            itemData["type"] +
            "," +
            itemData["model"] +
            "," +
            itemData["machineNumber"];

          itemData.type = fieldType;

          headersMachine.forEach((headerMachine) => {
            worksheet.getCell(currentColumn + currentRow).value = itemData[
              headerMachine.id
            ]
              ? String(itemData[headerMachine.id])
              : "-";
            if (
              [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
              ].find((item) => item === currentColumn)
            ) {
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
            }
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
