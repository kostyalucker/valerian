import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongoose";
import MachineModel from "@/models/Machine";
import DepartmentModel from "@/models/Department";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import UserModel from "@/models/User";
import IndicatorsModel from "@/models/Indicators";

async function validateMachine(machine: any) {
  const { machineNumber, model, department, machineCapacity } = machine;

  const isValidDepartment = ObjectId.isValid(department);

  const findedExistedmachine = await MachineModel.findOne({
    department,
    machineNumber,
  });

  return new Promise((resolve, reject) => {
    if (findedExistedmachine) {
      reject("Станок с таким номером уже существует");
    }

    if (model && machineNumber && isValidDepartment && machineCapacity) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { department } = req.query;
      const isValidObjectId = ObjectId.isValid(department);

      if (isValidObjectId) {
        const machines = await MachineModel.find({
          department,
        }).populate({
          path: "department",
          model: DepartmentModel,
          populate: {
            path: "user",
            model: UserModel,
          },
        });

        const result = machines.map(async (el) => {
          const indicators = await IndicatorsModel.find({
            machine: el._id,
          }).sort({ createdAt: -1 });

          return {
            ...el,
            indicator: indicators,
          };
        });

        const resultPromise = await Promise.all(result).then((res) => {
          return res.map((el: any) => {
            return {
              ...el["_doc"],
              indicator: el.indicator[0],
            };
          });
        });

        res.json(resultPromise);

        return;
      }

      res.status(400).json({
        error: "Станки не найдены",
      });
    } else if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      const machine = JSON.parse(req.body);
      const isCreatedMachineValid = await validateMachine(machine);
      const isRoleWithAccess =
        session?.user?.role === "SUPERADMIN" ||
        session?.user?.role === "ENGINEER";

      if (isRoleWithAccess && isCreatedMachineValid) {
        const insertedMachine = await MachineModel.insertMany([machine]);

        res.status(200).json({
          user: insertedMachine[0],
        });

        return;
      }

      throw new Error("error");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
}
