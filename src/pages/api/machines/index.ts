import { ObjectId } from "mongodb";
import dbConnect from "@/lib/mongoose";
import MachineModel from "@/models/Machine";
import DepartmentModel from "@/models/Department";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

async function validateMachine(machine: any) {
  const {
    machineNumber,
    model,
    machineType,
    department,
    emulsionFillingDate,
    machineCapacity,
  } = machine;

  const isValidDepartment = ObjectId.isValid(department);
  const isValidMachineType = ObjectId.isValid(machineType);

  return new Promise((resolve, reject) => {
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
        }).populate({ path: "department", model: DepartmentModel });

        res.json(machines);

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
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
