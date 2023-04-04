import { getServerSession } from 'next-auth';
import dbConnect from '../../lib/mongoose';
import Department from '../../models/Department';
import Factory from '../../models/Factory';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req,
  res
) {
  try {
    await dbConnect()

    const { userId } = req.query;

    if (userId) { 
      const factory = await Factory.findOne({
        user: userId
      })

      console.log(factory, userId)

      if (!factory?._id) {
        throw new Error('User factory not found')
      }

      const departments = await Department.find({
        factory: factory._id
      })

      res.json({
        departments
      });
    } else {
      const session = await getServerSession(req, res, authOptions);

      if (session?.user?.role === 'SUPERADMIN') {
        const departments = await Department.find();

        res.json(departments)
      }
    }

    res.status(400).json({
      error: 'Цеха не найдены' 
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}