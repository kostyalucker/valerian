import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongoose";
import MachineModel from "@/models/Machine";
import DepartmentModel from "@/models/Department";
import IndicatorsModel from "@/models/Indicators";
import UserModel from "@/models/User";

import { checkObjectProperties } from "@/utils/validateObjectProperties";

export default async function handler(req: any, res: any) {
  try {
    await dbConnect();
    if (req.method === "GET") {
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
    } else if (req.method === "PUT") {
      const { machineId } = req.query;
      const updateMachineParams = JSON.parse(req.body);


      const validateProperties = checkObjectProperties(updateMachineParams);

      if (validateProperties) {
        const updateMachine = await MachineModel.findByIdAndUpdate(
          machineId,
          updateMachineParams
        );

        res.status(200).json(updateMachine);
      } else {
        throw new Error();
      }
    } else if (req.method === "DELETE") {
      const { machineId } = req.query;

      const deletedMachine = await MachineModel.deleteOne({
        _id: machineId,
      });

      res.status(200).json({ result: deletedMachine });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
