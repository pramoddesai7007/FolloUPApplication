const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClockRecordSchema = new Schema({
  clockIn: { type: Date, required: true },
  clockInCoordinates: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  clockOut: { type: Date },
  clockOutCoordinates: {
    lat: { type: Number },
    long: { type: Number }
  },
  workDuration: { type: Number } // Duration in hours
});

// const EmployeeSchema = new Schema({
//   email: { type: String, required: true, unique: true },
//   clockRecords: [ClockRecordSchema],
//   hourlyRate: { type: Number, required: true }
// });

// const Employee = mongoose.model('Employee', EmployeeSchema);

// module.exports = Employee;
const SalarySchema = new Schema({
  email: { type: String, required: true, unique: true },
  clockRecords: [ClockRecordSchema],
  hourlyRate: { type: Number, required: true }
});

const Salary = mongoose.model('Salary', SalarySchema);

module.exports = Salary;
