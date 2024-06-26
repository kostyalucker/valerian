import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";

function createdName(user, role) {
  if (user.role === "CUSTOMER") {
    return `${user.companyName}`;
  }
  return `${user.lastName} ${user.firstName} ${user.patronomyc}`;
}

async function validateCustomer(customer) {
  const { email, password, companyName, address, region, city, inn } = customer;

  const findedUserWithEmail = await UserModel.findOne({ email });
  const findedUserWithInn = await UserModel.findOne({ inn });

  return new Promise((resolve, reject) => {
    if (
      companyName &&
      email &&
      address &&
      region &&
      city &&
      password &&
      !findedUserWithEmail &&
      !findedUserWithInn
    ) {
      resolve(true);
    } else {
      console.log("eror create");
      reject("Неверно введены данные или пользователь существует");
    }
  });
}

async function validateUser(user) {
  const {
    firstName,
    lastName,
    email,
    patronomyc,
    companyName,
    address,
    region,
    city,
    password,
  } = user;
  const findedUserWithEmail = await UserModel.findOne({ email });
  console.log(findedUserWithEmail, user);

  return new Promise((resolve, reject) => {
    if (
      firstName &&
      lastName &&
      patronomyc &&
      email &&
      address &&
      region &&
      city &&
      password &&
      !findedUserWithEmail &&
      !companyName
    ) {
      resolve(true);
    } else {
      reject("Неверно введены данные или пользователь существует");
    }
  });
}

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { userId, role } = req.query;
      if (role === "CUSTOMER") {
        const users = await UserModel.find({ creator: userId }).exec();
        res.json(users);
      } else {
        const users = await UserModel.find();
        res.json(users);
      }
    } else if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      const user = JSON.parse(req.body);

      const role = session?.user?.role;

      const isValidateUser =
        user.role === "CUSTOMER"
          ? await validateCustomer(user)
          : await validateUser(user);

      const SALT_ROUNDS = 10;
      const userWithFullName = {
        ...user,
        name: createdName(user, role),
      };

      if (isValidateUser) {
        role === "ENGINEER" || role === "SUPERADMIN" || role === "CUSTOMER"
          ? bcrypt.hash(user.password, SALT_ROUNDS, async function (err, hash) {
              if (err) {
                throw new Error(err);
              }

              const userWithHash = {
                ...userWithFullName,
                password: hash,
              };

              const insertedUser = await UserModel.insertMany([userWithHash]);

              res.status(200).json({
                user: insertedUser[0],
              });
            })
          : null;
      }
    } else if (req.method === "DELETE") {
      const deletedUserId = req.query.id;
      const isValidObjectId = ObjectId.isValid(deletedUserId);

      if (!isValidObjectId) {
        throw new Error("Invalid id");
      }

      const deletedUser = await UserModel.deleteOne({
        _id: ObjectId(deletedUserId),
      });

      res.status(200).json({
        ...deletedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "server error " + error,
    });
  }
}
