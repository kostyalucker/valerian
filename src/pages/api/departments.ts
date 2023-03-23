import dbConnect from '../../../lib/mongoose';
import Department from '../../models/Department';
import Factory from '../../models/Factory';

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

      if (!factory?._id) {
        throw new Error('User factory not found')
      }

      const departments = await Department.find({
        factory: factory._id
      })

      res.json({
        departments
      });
    }

    res.status(400).json({
      error: 'Цеха не найдены' 
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}