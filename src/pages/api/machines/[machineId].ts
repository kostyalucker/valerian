import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongoose';
import MachineModel from '@/models/Machine';
import DepartmentModel from '@/models/Department';
import IndicatorsModel from '@/models/Indicators';

export default async function handler(
  req,
  res
) {
  try {
    await dbConnect()

    const { machineId } = req.query;
    const isValidObjectId = ObjectId.isValid(machineId);

    if (isValidObjectId) { 
      const machineInfo = await MachineModel.findById(machineId).populate({ path: "department", model: DepartmentModel });
      const indicators = await IndicatorsModel.find({
        machine: machineInfo._id
      }).sort({ createdAt: -1 });
      // await IndicatorsModel.insertMany([
      //   {
      //     machine: "6409fb1be740456dfb15645c",
      //     ph: 25,
      //     concentration: 5,
      //     capacity: 30,
      //     creatorInfo: { firstName: 'Вася', lastName: 'Пупкин', patronymic: 'Федорович' },
      //   },
      //   {
      //     machine: "6409fb1be740456dfb15645c",
      //     ph: 2,
      //     concentration: 30,
      //     capacity: 5,
      //     creatorInfo: { firstName: 'Вася', lastName: 'Пупкин', patronymic: 'Федорович' },
      //   },
      // ])

      res.json({
        info: machineInfo,
        indicators: indicators,
      });

      return;
    }

    res.status(400).json({
      error: 'Информация о станке не найдена'
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}