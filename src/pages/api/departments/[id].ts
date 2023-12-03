import DepartmentModel from "@/models/Department";
import { getServerSession } from "next-auth";
import dbConnect from "../../../lib/mongoose";
import Department from "../../../models/Department";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: any, res: any) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { id } = req.query;

      const session = await getServerSession(req, res, authOptions);

      if (!id) {
        throw new Error("incorrect department");
      }

      const isRoleWithAccess =
        session?.user?.role === "SUPERADMIN" ||
        session?.user?.role === "ENGINEER";

      if (isRoleWithAccess) {
        const departments = await Department.findById(id);

        res.json(departments);
      }

      throw new Error();
    } else if (req.method === "DELETE") {
      const { id } = req.query;

      const deletedDepartment = await DepartmentModel.deleteOne({
        _id: id,
      });

      res.status(200).json({ result: deletedDepartment });
    } else if (req.method === "PUT") {
      const { id } = req.query;

      const updateDepartmentParams = JSON.parse(req.body);
      const updateDepartment = await DepartmentModel.findByIdAndUpdate(
        id,
        updateDepartmentParams
      );

      res.status(200).json(updateDepartment);
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
