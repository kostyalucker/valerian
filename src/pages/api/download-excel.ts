import xlsx, { readFile } from "xlsx";
import { NextApiRequest, NextApiResponse } from "next";

const dataVal = {
  _id: "656f4f71801d9b8cd4fca7b7",
  machineNumber: "Станок 40",
  model: "Ург",
  type: "Пупырка",
  machineCapacity: "130",
  oilName: "Олейна Премиум",
  recommendeConcentration: "140",
  refractionCoefficient: "49992",
  phMin: "6002",
  phMax: "100011",
  fillingDate: "03.12.2024",
  lastModifiedDate: "10.12.2024",
  department: {
    _id: "656dd08bc7f035cc686e0f42",
    name: "ceh 72",
    contactName: "gek pek cek",
    contactPhone: "03",
    contactEmail: "goka@mail.ru",
    __v: 0,
    createdAt: "2023-12-04T13:13:47.865Z",
    updatedAt: "2023-12-04T14:35:38.177Z",
  },
  __v: 0,
  createdAt: "2023-12-05T16:27:29.924Z",
  updatedAt: "2024-01-18T10:56:28.149Z",
  emulsionFillingDate: "2024-01-18T10:56:28.148Z",
};
const dataValLastIndicator = {
  _id: "65a90a9d184e34493c49d4dd",
  machine: "656f4f71801d9b8cd4fca7b7",
  ph: "2522",
  concentration: "232",
  conductivity: "4242",
  bacteriaAmount: "44",
  fungi: "присутствуют",
  foaming: "22",
  fungicide: "2424",
  smell: "Умеренный",
  presenceImpurities: "Нет",
  antiFoamAdditive: "242",
  batchNumberDate: "4",
  notesRecommendations: "242",
  creatorName: "Admin",
  addedOilAmount: "25",
  biocide: "1212",
  __v: 0,
  createdAt: "2024-01-18T11:25:17.389Z",
  updatedAt: "2024-01-18T11:25:17.389Z",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Создание данных с описанием и таблицей в одном массиве
    const combinedData = [
      // Описание
      ["РАбоч", "описание"],
      ["Ячейки", "описание"],
      [], // Добавляем пустую строку для отступа
      // Таблица
      [
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

        // ... добавьте остальные заголовки тут
      ],
      [
        "", // Пустая ячейка для отступа
        dataVal._id,
        dataVal.type,
        dataVal.model,
        dataVal.machineNumber,
        dataVal.oilName,
        dataVal.recommendeConcentration,
        dataVal.lastModifiedDate,
        dataValLastIndicator.concentration,
        dataValLastIndicator.ph,
        dataValLastIndicator.conductivity,
        "здесь будет значение свойства",
        dataValLastIndicator.addedOilAmount,
        dataValLastIndicator.foaming,
        dataValLastIndicator.smell,
        dataValLastIndicator.fungi,
        dataValLastIndicator.presenceImpurities,
        "здесь будет значение свойства",
        dataValLastIndicator.notesRecommendations,
        "здесь будет значение свойства",
        dataValLastIndicator.fungi,
        dataValLastIndicator.biocide,
        "здесь будет значение свойства",

        // ... продолжаем заполнять данными как раньше
      ],
    ];
    const combinedWs = xlsx.utils.aoa_to_sheet(combinedData);

    // Устанавливаем жирное начертание для ячеек в четвертой строке
    for (let i = 0; i < combinedData[3].length; i++) {
      combinedWs[xlsx.utils.encode_cell({ r: 3, c: i })].s = {
        font: { bold: true }, color: {rgb: "FF0000"},
      };
    }

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, combinedWs, "СombineData"); // Добавляем лист с данными и описанием

    // Сборка ответа
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
      "attachment; filename=filledData.xlsx"
    );
    res.status(200).end(excelBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while filling the Excel template");
  }
}
