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
  { id: "createdAt", translate: "Дата" },
  { id: "concentration", translate: "Концентрация, %" },
  { id: "ph", translate: "рН" },
  { id: "conductivity", translate: "Электропроводность, µS/cm" },
  { id: "emulsionLevel", translate: "Уровень эмульсии" },
  { id: "addedOilAmount", translate: "Долив (л)" },
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
  // {
  //   name: "machineType",
  //   id: 9,
  // },
  // {
  //   name: "machineModel",
  //   id: 10,
  // },
  {
    name: "machineType",
    id: 11,
    label: "Тип оборудования",
  },
  {
    name: "machineModel",
    label: "Модель",
    id: 12,
  },
]; // id = Номер строки, в которой вы хотите установить значение

const rowsGeneralInformations = [
  {
    name: "emulsionFillingDate",
    id: 1,
  },
  {
    name: "product",
    id: 3,
  },
  {
    name: "refractionCoefficient",
    id: 4,
  },
  {
    name: "recommendeConcentration",
    id: 5,
  },
];
const columnNameInf = "D";
const columnGeneralInformations = "N";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workbook = new Workbook();
  const filePath = "./src/assets/templateReport.xlsx"; // Укажите путь к вашему шаблону XLSX

  try {
    if (req.method === "POST") {
      const parseBody = await JSON.parse(req.body);

      const indicators = parseBody.indicators;
      const dataInf: DataInf = parseBody.data;
      const generalInformation: DataInf = parseBody.generalInformation;

      const fetchedWorkbook = await workbook.xlsx.readFile(filePath);
      let worksheet: Worksheet | undefined = fetchedWorkbook.getWorksheet(
        "По конкретному станку"
      );

      if (worksheet) {
        // Установка значений и стиля

        rowsGeneralInformations.forEach((row) => {
          const adressCell = columnGeneralInformations + row.id;
 
          if (row.id === 3) {
            worksheet.getCell(adressCell).value = "Supreme Lubri";
          } else {
            worksheet.getCell(adressCell).value = generalInformation[row.name];
          }
        });

        rows.forEach((row) => {
          const adressCell = columnNameInf + row.id;
          // Обращение к нужной ячейке и установка значения
          console.log(
            dataInf[row.name],
            dataInf,
            row.name,
            "dataInf[row.name]"
          );
          worksheet.getCell(adressCell).value = row.label
            ? `${row.label}: ${dataInf[row.name]}`
            : dataInf[row.name];
        });

        // Начать заполнение с 19 строки
        let currentRow = 19;
        let currentColumn = "A";

        // Перебор вашего массива данных и запись в ячейки соответствующих данных
        indicators.forEach((itemData: any) => {
          headersMachine.forEach((headerMachine) => {
            worksheet.getCell(currentColumn + currentRow).value =
              headerMachine.id === "createdAt"
                ? formatDateTime(itemData.createdAt)
                : itemData[headerMachine.id]; // Установка значения в ячейку
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
