import express from 'express';
import ClosingRecord from '../models/ClosingRecord.js'; // <-- Notice the .js extension!

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const records = await ClosingRecord.find();
    res.json({ success: true, data: records });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const record = await ClosingRecord.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

export default router;