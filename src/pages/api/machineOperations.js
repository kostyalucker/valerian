import dbConnect from '@/lib/mongoose';
import MachineOperationModel from '@/models/MachineOperation';

export default async function handler(
  req,
  res
) {
  try {
    await dbConnect()

    const { machineType } = req.query;

    if (machineType) {
      const machineTypes = await MachineOperationModel.find({
        machineType
      });

      res.json(machineTypes)
    } else {
      throw new Error()
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Server error' });
  }

}

 // add machine types
    // await MachineOperationModel.insertMany([
    //   {
    //     name: 'токарный'
    //   },
    //   {
    //     name: 'шлифовальный'
    //   },
    //   {
    //     name: 'фрезерный'
    //   }
    // ]);

    // add machine operations

 // await MachineOperation.insertMany([
    //   {
    //     name: 'шлифование',
    //     machineType: '6425923c0dfd856a7db701d5',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '4'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'точение',
    //     machineType: '6425923c0dfd856a7db701d4',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '6'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'сверление',
    //     machineType: '6425923c0dfd856a7db701d4',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '6'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'нарезание резьбы',
    //     machineType: '6425923c0dfd856a7db701d4',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '6'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'фрезерование',
    //     machineType: '6425923c0dfd856a7db701d6',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '7'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'зенкерование',
    //     machineType: '6425923c0dfd856a7db701d6',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '7'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   },
    //   {
    //     name: 'развертывание отверстий',
    //     machineType: '6425923c0dfd856a7db701d6',
    //     standards: {
    //       ph: {
    //         min: '8.7',
    //         max: '11'
    //       },
    //       concentration: {
    //         min: '0',
    //         max: '7'
    //       },
    //       conductivity: {
    //         min: '0',
    //         max: '6000'
    //       },
    //       bacteriaAmout: {
    //         min: '0',
    //         max: '100000'
    //       },
    //       fungi: {
    //         min: '0',
    //         max: '0'
    //       }
    //     }
    //   }
    // ])