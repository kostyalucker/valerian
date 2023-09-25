import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongoose";
import MachineModel from "@/models/Machine";
import DepartmentModel from "@/models/Department";
import IndicatorsModel from "@/models/Indicators";
import UserModel from "@/models/User";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { machineId } = req.query;
    const isValidObjectId = ObjectId.isValid(machineId);

    if (isValidObjectId) {
      const machineInfo = await MachineModel.findById(machineId).populate({
        path: "department",
        model: DepartmentModel,
        populate: {
          path: "user",
          model: UserModel,
        },
      });
      const indicators = await IndicatorsModel.find({
        machine: machineInfo._id,
      }).sort({ createdAt: -1 });

      res.json({
        info: machineInfo,
        indicators: indicators,
      });

      return;
    }

    res.status(400).json({
      error: "Информация о станке не найдена",
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
