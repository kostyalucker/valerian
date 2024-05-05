import dbConnect from "@/lib/mongoose";
import IndicatorsModel from "@/models/Indicators";
import MachineModel from "@/models/Machine";

function validateIndicator(indicatorData) {
  const isValidIndicator = Object.keys(indicatorData).reduce((acc, curr) => {
    if (!indicatorData[curr]) {
      acc = false;
    }

    return acc;
  }, true);

  return isValidIndicator;
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const indicator = JSON.parse(req.body);

      const indicators = await IndicatorsModel.find({
        machine: indicator.machine,
      }).sort({
        createdAt: -1,
      });
      const machine = await MachineModel.findById(indicator.machine);
      const validPh =
        Number(indicator.ph) >= Number(machine.phMin) &&
        Number(indicator.ph) <= Number(machine.phMax);

      const minConcentration = Number(machine.recommendeConcentration) - 0.5;
      const maxConcentration = Number(machine.recommendeConcentration) + 1;

      const validConcetration =
        Number(indicator.concentration) >= minConcentration &&
        Number(indicator.concentration) <= maxConcentration;

      await MachineModel.findByIdAndUpdate(indicator.machine, {
        valid: validPh && validConcetration ? true : false,
      });

      const test = validPh && validConcetration ? true : false;

      console.log(validPh, validConcetration, "validPh, 'validConcetration'");
      if (Number(indicator.addedOilAmount) > 0) {
        const updatedMachine = await MachineModel.findByIdAndUpdate(
          indicator.machine,
          {
            emulsionFillingDate: new Date().toISOString(),
          }
        );
      }

      const isValidIndicator = validateIndicator(indicator);

      if (!isValidIndicator) {
        res.status(400).json({
          error: "Неккоректно введены данные",
        });
      }

      await IndicatorsModel.insertMany([indicator]);

      res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: "Server error" });
    }
  } else if (req.method === "GET") {
    const { id } = req.query;

    try {
      const indicators = await IndicatorsModel.find({ machine: id }).sort({
        createdAt: -1,
      });

      res.status(200).json({ indicators });
    } catch (error) {
      res.status(400).json({ error: "Server error" });
    }
  }
}
