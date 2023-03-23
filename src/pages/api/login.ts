import UserModel from '../../models/User'
import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/mongoose';

export default async function handler(req: any, res: any) {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })

            return
        }

        await dbConnect();

        const body = JSON.parse(JSON.stringify(req.body))
        const users = await UserModel.find({});

        const user = users.find((user) => user.email === body.email);

        
        if (!user) {
            res.status(404).send({ message: 'User does not exit!' })

            return
        }

        await bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                res.status(200).json(user);
            }

            res.status(401).json({
                error: 'Access denied'
            });
        })
    } catch (error) {
        res.status(405).send({ message: `${error}` })
        return
    }
};