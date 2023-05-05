import { getServerSession } from "next-auth";
import dbConnect from "../../lib/mongoose";
import Department from "../../models/Department";
import Factory from "../../models/Factory";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { userId } = req.query;

    if (userId) {
      const factory = await Factory.findOne({
        user: userId,
      });

      if (!factory?._id) {
        throw new Error("User factory not found");
      }

      const departments = await Department.find({
        factory: factory._id,
      });

      res.json({
        departments,
        factory,
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
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Server error" });
  }
}
