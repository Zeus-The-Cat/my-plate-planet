import db from '../../utils/db';

export default async function handler(req, res){
  try {
    const entries = await db.collection('dataset').get();
    res.status(200).json(entries.docs[0].data());
  } catch (e) {
    res.status(400).end();
  }
}