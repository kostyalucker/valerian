import UserModel from '@/models/User';
import FactoryModel from '@/models/Factory';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongoose';

async function validateUser(user) { 
  const { firstName, lastName, email, patronomyc, password, companyName } = user;
  const findedUserWithEmail = await UserModel.findOne({ email });

  return new Promise((resolve, reject) => {
    if (firstName && lastName && patronomyc && email && password && !findedUserWithEmail && !companyName) {
      resolve(true)
    } else {
      reject('Неверно введены данные или пользователь существует')
    }
  })
}

export default async function handler(req, res) {
  const users = [
    {
      id: 1,
      name: 'John',
    },
    {
      id: 2,
      name: 'Johny',
    }
  ]

  
  try {
    await dbConnect();

    if (req.method === 'GET') {
      res.json(users)
    } else if (req.method === 'POST') { 
      const session = await getServerSession(req, res, authOptions);
      const user = JSON.parse(req.body);
      const isCreatedUserValid = await validateUser(user);
      const saltRounds = 10;
      const userWithFullName = {
        ...user,
        name: `${user.lastName} ${user.firstName} ${user.patronomyc}`
      }

      if (session?.user?.role === 'SUPERADMIN' && isCreatedUserValid) {
        bcrypt.hash(user.password, saltRounds, async function(err, hash) {
          if (err) {
            throw new Error(err)
          }

          const userWithHash = {
            ...userWithFullName,
            password: hash
          }

          const insertedUser = await UserModel.insertMany([
            userWithHash
          ])

          if (userWithHash.role === 'CUSTOMER' && insertedUser && insertedUser[0]) {
            await FactoryModel.insertMany([{
              name: `Компания: ${userWithHash.name}`,
              user: insertedUser[0]._id
            }])
          }

          res.status(200).json({
            user: insertedUser[0],
          })

          return;
        });
      }
    }
  } catch (error) {
    console.log('server error: ' + error)
    res.status(500).json({
      error: 'server error' + error
    })
  }
}