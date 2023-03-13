import UserModel from '../../models/User'

export default async function handler(req: any, res: any) {
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
        }

        const body = JSON.parse(JSON.stringify(req.body))
        const users = await UserModel.find({});

        const user = users.find((user) => user.email === body.email && user.password === body.password);

        if (!user) {
            res.status(404).send({ message: 'User does not exit!' })
            return
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(405).send({ message: `{error.message}` })
        return
    }
};