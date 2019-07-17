import mongoose from 'mongoose';
import { registerEvents } from './user.events';
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  first_name: {
      type: String,
      required: true,
      trim: true,
  },
  last_name: {
      type: String,
      trim: true,
  },
  email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
  },
  phone:[String],
  active: Boolean,
  created_on: { type: Date, default: Date.now },
  updated_on: Date,
  updated_by: ObjectId,
  deleted_on: Date,
  deleted_by: ObjectId
});

registerEvents(UserSchema);
export default mongoose.model('User', UserSchema);
