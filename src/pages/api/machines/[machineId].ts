import { ObjectId } from 'mongodb';
import dbConnect from '../../../../lib/mongoose';
import MachineModel from '../../../models/Machine';
import DepartmentModel from '../../../models/Department';
import IndicatorsModel from '../../../models/Indicators';

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
      const indicators = await IndicatorsModel.findOne({
        machine: machineInfo._id
      }).sort({ createdAt: -1 });

      res.json({
        info: machineInfo,
        indicators: indicators,
      });
    }

    res.status(400).json({
      error: 'Информация о станке не найдена'
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}