
import express from 'express';
import DailyAssignment from '../models/DailyAssignment.js'; // <-- Notice the .js extension!

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const records = await DailyAssignment.find().populate('salesmanId', 'name');
    res.json({ success: true, data: records });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const record = await DailyAssignment.create(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', async (req, res) => {
    try {
      const record = await DailyAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, data: record });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

export default router;