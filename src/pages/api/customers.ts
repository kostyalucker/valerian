import { NextApiResponse, NextApiRequest } from 'next';
import dbConnect from '../../../lib/mongoose';
import UserModel from '../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()

    const customers = await UserModel.find({
      role: 'CUSTOMER'
    })

    res.json(
      customers
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: `Server error ${e}` });
  }

}