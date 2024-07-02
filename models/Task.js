const mongoose = require('mongoose');
const moment = require('moment');


// Define the schema for tasks
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignTo: [{
    type: mongoose.Schema.Types.ObjectId, // Assuming assignTo is a reference to Employee
    ref: 'Employee', // Reference to the Employee model
    required: true,
  }],
  startDate: {
    type: Date, // Date for task start
    required: true,
  },
  deadlineDate: {
    type: Date, // Date for task deadline
    required: true,
  },
  reminderDate: {
    type: Date, // Date for task reminder
    // required: true,
  },
  startTime: {
    type: String, // Time for task start
    required: true,
  },
  endTime: {
    type: String, // Time for task end
    required: true,
  },
  reminderTime: {
    type: String, // Time for task end
    // required: true,
  },
  picture: {
    type: String, // File path or URL to the picture (if applicable)
  },
  audio: {
    type: String, // File path or URL to the audio (if applicable)
  },
  phoneNumber:{
    type: String,
  },
  status: {
    type: String, // Status of the task (e.g., 'pending', 'completed')
    required: true,
    default: 'pending',
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required:true
  }
});



// taskSchema.pre('save', function (next) {
//   if (this.endTime) {
//     const endTime24hr = moment(this.endTime, ['h:mm A']).format('HH:mm');
//     const period = moment(this.endTime, ['h:mm A']).format('A');
//     this.endTime = `${endTime24hr} ${period}`;
//   }
//   next();
// });


taskSchema.pre('save', function (next) {
  if (this.endTime) {
    this.endTime = moment(this.endTime, ['h:mm A', 'hh:mm']).format('hh:mm');
  }
  next();
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
