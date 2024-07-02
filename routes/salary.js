//import connectToDatabase from '../../lib/db';
const Salary = require('../models/Salary');
//const { getCoordinates } = require('../../lib/location');
const express = require('express');
const router = express.Router();
const getLocation = require('../utils/geoLocation');
const fs = require('fs');
const path = require('path');


const IP_FILE = path.join(__dirname, 'IP.json'); // Adjust path as needed

// Function to read IP addresses from the file
const readIPAddresses = () => {
    try {
        const data = fs.readFileSync(IP_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};



// Function to read IP addresses from the file
// const readIPAddresses = () => {
//   try {
//       const data = fs.readFileSync(IP_FILE, 'utf8');
//       return JSON.parse(data);
//   } catch (err) {
//       return [];
//   }
// };

// POST endpoint to clock in
router.post('/clock-ins', async (req, res) => {
  const { email,role,ip,lat,long } = req.body;
  const l= lat;
  const lo= long;
  const now = new Date();
  console.log(now);

  let coordinates;

  if (role === 'sales') {
      //coordinates = await getLocation(ip);
      coordinates = {
             lat: l,
            long: lo
          };
  } else {
      const validIPs = readIPAddresses();
      if (validIPs.includes(ip)) {
          coordinates = {
            lat: l,
           long: lo
         };
      } else {
          return res.status(403).json({ message: 'Invalid work location tracked' });
      }
  }

  console.log(coordinates);

  if (!coordinates) {
      return res.status(500).json({ message: 'Failed to get location' });
  }

  const salary = await Salary.findOne({ email });
  if (!salary) {
      return res.status(404).json({ message: 'Employee not found' });
  }

  salary.clockRecords.push({
      clockIn: now,
      clockInCoordinates: coordinates,
      clockOut: null,
      clockOutCoordinates: null,
      workDuration: null
  });

  await salary.save();

  res.status(200).json({ message: 'Clocked in successfully' });
});



router.post('/clock-in',async (req, res) => {
    const { email } = req.body;
    const now = new Date();
    console.log(now)
    //const coordinates = await getCoordinates();

    // const coordinates ={
    //     lat: 12.9715987,
    //     long: 77.594566
    //   };
  
    //******************* */
    //const ip = req.ip;
    const sampleIp = '192.168.55.33';
  const coordinates = await getLocation(sampleIp);
  console.log(coordinates)

  if (!coordinates) {
    return res.status(500).json({ message: 'Failed to get location' });
  }


    //******************** */
  
    const salary = await Salary.findOne({ email });
    if (!salary) {
      return res.status(404).json({ message: 'Employee not found' });
    }
  
    salary.clockRecords.push({
      clockIn: now,
      clockInCoordinates: coordinates,
      clockOut: null,
      clockOutCoordinates: null,
      workDuration: null
    });
  
    await salary.save();
  
    res.status(200).json({ message: 'Clocked in successfully' });
  });

//   router.post('/clock-out',async (req, res) => {
//     const { email } = req.body;
//    // const now = new Date();
//     const now = new Date("2024-06-24T018:53:51.548Z");
//     //const coordinates = await getCoordinates();
//     const coordinates={
//         lat: 12.9715987,
//         long: 77.594566
//       };
  
  
//     //await connectToDatabase();
  
//     const salary = await Salary.findOne({ email });
//     if (!salary) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
  
//     const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];
//     const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60);

//     console.log(workDuration)
  
//     lastClockRecord.clockOut = now;
//     lastClockRecord.clockOutCoordinates = coordinates;
//     lastClockRecord.workDuration = workDuration;
  
//     await salary.save();
  
//     res.status(200).json({ message: 'Clocked out successfully' });
//   });
router.post('/clock-out', async (req, res) => {
    const { email } = req.body;
    //const now = new Date("2024-06-25T14:06:20.143+00:00");
    const now = new Date();
   console.log(now)
    // Static coordinates for testing
    const coordinates = {
      lat: 12.9715987,
      long: 77.594566
    };
  
    try {
      const salary = await Salary.findOne({ email });
      if (!salary) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];
  
      if (!lastClockRecord || !lastClockRecord.clockIn) {
        return res.status(400).json({ message: 'No active clock-in found' });
      }
  
      const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours
      console.log('Calculated work duration:', workDuration);
  
      lastClockRecord.clockOut = now;
      lastClockRecord.clockOutCoordinates = coordinates;
      lastClockRecord.workDuration = workDuration;
  
      await salary.save();
  
      res.status(200).json({ message: 'Clocked out successfully' });
    } catch (error) {
      console.error('Error during clock-out:', error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/clock-outs', async (req, res) => {
    const { email,role,ip,lat,long } = req.body;
  const l= lat;
  const lo= long;
    //const now = new Date("2024-06-25T14:06:20.143+00:00");
    const now = new Date();
   console.log(now)
    // Static coordinates for testing
    let coordinates;

  if (role === 'sales') {
      coordinates = {
        lat: l,
       long: lo
     };
  } else {
      const validIPs = readIPAddresses();
      if (validIPs.includes(ip)) {
          coordinates = {
            lat: l,
           long: lo
         };
      } else {
          return res.status(403).json({ message: 'Invalid work location tracked' });
      }
  }

  console.log(coordinates);

  if (!coordinates) {
      return res.status(500).json({ message: 'Failed to get location' });
  }
  
    try {
      const salary = await Salary.findOne({ email });
      if (!salary) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      const lastClockRecord = salary.clockRecords[salary.clockRecords.length - 1];
  
      if (!lastClockRecord || !lastClockRecord.clockIn) {
        return res.status(400).json({ message: 'No active clock-in found' });
      }
  
      const workDuration = (now - new Date(lastClockRecord.clockIn)) / (1000 * 60 * 60); // Duration in hours
      console.log('Calculated work duration:', workDuration);
  
      lastClockRecord.clockOut = now;
      lastClockRecord.clockOutCoordinates = coordinates;
      lastClockRecord.workDuration = workDuration;
  
      await salary.save();
  
      res.status(200).json({ message: 'Clocked out successfully' });
    } catch (error) {
      console.error('Error during clock-out:', error);
      res.status(500).json({ message: error.message });
    }
  });

  router.post('/calculate-salary',async (req, res) => {
    const { email, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    
  
    const salary = await Salary.findOne({ email });
    if (!salary) {
      return res.status(404).json({ message: 'Employee not found' });
    }
  
    let totalHours = 0;
  
    salary.clockRecords.forEach(record => {
      if (record.clockIn >= start && record.clockOut <= end) {
        totalHours += record.workDuration;
      }
    });
  console.log(totalHours);
  console.log(salary.hourlyRate);
    const total = totalHours * salary.hourlyRate;
  
    res.status(200).json({ total });
  });



  
  router.post('/set-rate',async (req, res) => {
    const { email, hourlyRate } = req.body;
  
    //await connectToDatabase();
  
    const salary = await Salary.findOneAndUpdate(
      { email },
      { hourlyRate },
      { new: true, upsert: true }
    );
  
    if (!salary) {
      return res.status(404).json({ message: 'Employee not found' });
    }
  
    res.status(200).json({ message: 'Hourly rate updated successfully', salary });
  });

  // Endpoint to fetch date-wise work hours for an employee


    // Endpoint to fetch date-wise work hours for an employee
router.post('/fetch-work-hours', async (req, res) => {
  const { email, startDate, endDate } = req.body;
  
  try {
    const salary = await Salary.findOne({ email });
    if (!salary) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let workHoursByDate = {};

    salary.clockRecords.forEach(record => {
      const recordDate = new Date(record.clockIn);
      if (recordDate >= start && recordDate <= end) {
        const dateKey = recordDate.toISOString().slice(0, 10); // YYYY-MM-DD format
        const workHours = record.workDuration || 0;
        if (!workHoursByDate[dateKey]) {
          workHoursByDate[dateKey] = 0;
        }
        workHoursByDate[dateKey] += workHours;
      }
    });

    res.status(200).json({ workHoursByDate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


    


// Function to write IP addresses to the file
const writeIPAddresses = (ips) => {
    fs.writeFileSync(IP_FILE, JSON.stringify(ips, null, 2), 'utf8');
};

// POST endpoint to store IP addresses
router.post('/ip', (req, res) => {
    const { ip } = req.body;

    if (!ip) {
        return res.status(400).json({ message: 'IP address is required' });
    }

    const ipAddresses = readIPAddresses();
    ipAddresses.push(ip);
    writeIPAddresses(ipAddresses);

    res.status(201).json({ message: 'IP address stored successfully', ip });
});

// GET endpoint to fetch all stored IP addresses
router.get('/ip', (req, res) => {
    const ipAddresses = readIPAddresses();
    res.status(200).json(ipAddresses);
});

router.post('/calculate-hourly-wage', (req, res) => {
  const { totalSalary, days, dailyShift } = req.body;

  if (!totalSalary || !days || !dailyShift) {
      return res.status(400).json({ error: 'Please provide totalSalary, days, and dailyShift' });
  }

  const hourlyRate = (totalSalary / days) / dailyShift;

  res.json({ hourlyRate });
});



  module.exports = router;