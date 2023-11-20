import { ObjectId } from "mongodb";
import UserModel from "@/models/User";
import dbConnect from "@/lib/mongoose";

export default async function handler(req, res) {
  try {
    await dbConnect();
    const { id } = req.query;
    const isValidObjectId = ObjectId.isValid(id);

    if (!isValidObjectId) {
      throw new Error("Invalid id");
    }

    if (req.method === "GET") {
      const user = await UserModel.findById(id);

      res.status(200).json(user);
    } else if (req.method === "DELETE") {
      await UserModel.deleteOne({
        _id: id,
      });

      res.status(200).json({
        id,
      });
    } else if (req.method === "PUT") {
      const updateUserParams = JSON.parse(req.body);
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updateUserParams
      );

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({
      error: "server error" + error,
    });
  }
}