
import mongoose from "mongoose";
// Area Assignment Schema
const areaAssignmentSchema = new mongoose.Schema({
  area: {
    type: String,
    required: [true, 'Area name is required'],
    unique: true,
    trim: true,
    maxlength: [200, 'Area name cannot exceed 200 characters']
  },
  salesmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salesman',
    default: null
  },
  customerCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


export const AreaAssignment = mongoose.model('AreaAssignment', areaAssignmentSchema);
