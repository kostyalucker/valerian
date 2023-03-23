import { ObjectId } from 'mongodb';
import dbConnect from '../../../../lib/mongoose';
import IndicatorsModel from '../../../models/Indicators';

export default async function handler(req, res) { 
  try {
    await dbConnect();

    
    if (req.method === 'GET') {
      const { id } = req.query;
      const isValidObjectId = ObjectId.isValid(id);

      if (!isValidObjectId) {
        throw new Error()
      }

      const indicator = await IndicatorsModel.findById(id);

      res.status(200).json(indicator);
    }
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error
    })
  }
}