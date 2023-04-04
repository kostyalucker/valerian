import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongoose';
import IndicatorsModel from '@/models/Indicators';

export default async function handler(req, res) { 
  try {
    await dbConnect();
    const { id } = req.query;
    const isValidObjectId = ObjectId.isValid(id);

    
    if (req.method === 'GET') {

      if (!isValidObjectId) {
        throw new Error()
      }

      const indicator = await IndicatorsModel.findById(id);

      res.status(200).json(indicator);
    } else if (req.method === 'PUT') { 
      const updateIndicatorParams = JSON.parse(req.body);
      const updatedIndicator = await IndicatorsModel.findByIdAndUpdate(id, updateIndicatorParams);

      res.status(200).json(updatedIndicator);
    }
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error
    })
  }
}