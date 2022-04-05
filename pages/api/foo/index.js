import db from '../../../utils/db';

export default async (req, res) => {
  try {
    const { slug } = req.body;
    const dataset = await db.collection('dataset').get();
    const entriesData = dataset.docs.map(collectionIndex => collectionIndex.data());

    console.log(JSON.stringify(entriesData))
    if (entriesData.some(entry => entry.slug === slug)) {
      res.status(400).end();
    } else {
      const { id } = await db.collection('dataset').add({
        ...req.body,
        created: new Date().toISOString(),
      });
      res.status(200).json({ id });
    }
}