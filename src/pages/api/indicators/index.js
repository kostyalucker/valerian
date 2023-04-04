import dbConnect from '@/lib/mongoose';
import IndicatorsModel from '@/models/Indicators';

export default async function handler(
  req,
  res
) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const json = JSON.parse(req.body)
      const { 
        creatorName,
        concentration,
        fungi,
        ph,
        conductivity,
        bacteriaAmount,
        machineId
      } = json;

      if (!fungi || !bacteriaAmount || !conductivity || !ph || !creatorName|| !concentration || !machineId) {
        res.status(400).json({
          error: 'Неккоректно введены данные' 
        })
      }

      await IndicatorsModel.insertMany([{
        ph,
        creatorName,
        machine: machineId,
        concentration,
        fungi,
        conductivity,
        bacteriaAmount
      }])

      res.status(200).json({ ok: true});
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const indicators = await IndicatorsModel.find({ machine: id}).sort({ createdAt: -1 });

      res.status(200).json({ indicators });
    } catch (error) {
      res.status(400).json({ error: 'Server error' });
    }
  }
}