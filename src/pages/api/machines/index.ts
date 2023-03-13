import { ObjectId } from 'mongodb';
import dbConnect from '../../../../lib/mongoose';
import MachineModel from '../../../models/Machine';
import DepartmentModel from '../../../models/Department';

export default async function handler(
  req,
  res
) {
  try {
    await dbConnect()

    const { department } = req.query;
    const isValidObjectId = ObjectId.isValid(department);

    if (isValidObjectId) { 
      const machines = await MachineModel.find({
        department
      }).populate({ path: "department", model: DepartmentModel });

      res.json(
        machines
      );
    }

    res.status(400).json({
      error: 'Станки не найдены'
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}