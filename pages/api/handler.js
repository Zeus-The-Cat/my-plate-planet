import db from './db';

export default async function handler(_, res){
  try {
    const entries = await db.collection('dataset').get();
    res.status(200).json({
      FoodItems: entries.docs[0].data(),
      statistics: entries.docs[1].data()});
  } catch (e) {
    res.status(400).end();
  }
}