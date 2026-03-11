import express from 'express';
import StockAdjustment from '../models/StockAdjustment.js';
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const records = await StockAdjustment.find();
    res.json({ success: true, data: records });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const record = await StockAdjustment.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

export default router;