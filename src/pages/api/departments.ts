import DepartmentModel from "@/models/Department";
import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongoose";
import Department from "../../models/Department";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { userId } = req.query;

      if (userId) {
        const departments = await Department.find({
          user: userId,
        });

        res.json({
          departments,
        });
      } else {
        const session = await getServerSession(req, res, authOptions);
        const departmentId = Object.keys(req.query)[0];

        if (!departmentId) {
          throw new Error("incorrect department");
        }

        const isRoleWithAccess =
          session?.user?.role === "SUPERADMIN" ||
          session?.user?.role === "ENGINEER";

        if (isRoleWithAccess) {
          const departments = await Department.findById(departmentId);

          res.json(departments);
        }

        throw new Error();
      }
    } else if (req.method === "POST") {
      const department = JSON.parse(req.body);

      const insertedDepartment = await DepartmentModel.insertMany([department]);

      res.status(200).json(insertedDepartment[0]);
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
