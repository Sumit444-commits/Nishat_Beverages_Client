// import express from 'express';
// import DailyReminder from '../models/DailyReminder.js';
// const router = express.Router();
// router.get('/', async (req, res) => {
//   try {
//     const records = await DailyReminder.find();
   
//     res.json({ success: true, data: records });
//   } catch (err) { res.status(500).json({ success: false, message: err.message }); }
// });

// router.post('/', async (req, res) => {
//   try {
//     const record = await DailyReminder.create(req.body);
//      console.log(record)
//     res.status(201).json({ success: true, data: record });
//   } catch (err) { res.status(400).json({ success: false, message: err.message }); }
// });

// export default router;


import express from 'express';
import DailyReminder from '../models/DailyReminder.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const records = await DailyReminder.find();
    res.json({ success: true, data: records });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
});

router.post('/', async (req, res) => {
  try {
    // 💡 SAFETY NET: If the frontend forgets the date, add it automatically
    const payload = {
        ...req.body,
        date: req.body.date || new Date().toISOString()
    };

    const record = await DailyReminder.create(payload);
    console.log("Reminder saved:", record);
    
    res.status(201).json({ success: true, data: record });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
});

export default router;