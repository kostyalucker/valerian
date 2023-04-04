import { getServerSession } from 'next-auth/next';
import clientPromise from '../../lib/mongodb';
import { authOptions } from './auth/[...nextauth]';
import UserModel from '@/models/User';

export default async function handler(req: any, res: any) {
    try {
        if (req.method === 'POST') {
          try {
            const client = await clientPromise;
            const db = client.db("valerian"); 
            const user = JSON.parse(req.body);
            const session = await getServerSession(req, res, authOptions);
            
            if (user.name && user.password && user.role && user.email) {
              // const users = usersCollection.insertOne(user)
              const users = [1]

              res.json(users);
            }
          } catch (e) {
            console.error(e);
            res.status(400).json({ error: 'Server error' });
          }
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
        } else if (req.method === 'GET') {
          const users = await UserModel.find()

          res.json(users);
        }
    } catch (error) {
        res.status(405).send({ message: `{error.message}` })
        return
    }
};