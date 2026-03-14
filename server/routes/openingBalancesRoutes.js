import express from 'express';
import OpeningBalance from '../models/OpeningBalanceModel.js'; 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const records = await OpeningBalance.find();
    res.json({ success: true, data: records });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

router.post('/', async (req, res) => {
  try {
    let record = await OpeningBalance.findOne({ date: req.body.date });
    if (record) {
        record.cash = req.body.cash;
        record.bank = req.body.bank;
        await record.save();
    } else {
        record = await OpeningBalance.create(req.body);
    }
    res.status(201).json({ success: true, data: record });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
});

export default router;