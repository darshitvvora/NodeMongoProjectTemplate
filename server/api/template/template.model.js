import mongoose from 'mongoose';
import { registerEvents } from './template.events';
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


const TemplateSchema = new mongoose.Schema({
  name: String,
  html: String,
  sections: [{
      html: String,
      order: Number,
      variables: Mixed,
  }],
  active: Boolean,
  created_on: { type: Date, default: Date.now },
  created_by: {type: ObjectId, ref: 'User'},
  updated_on: Date,
  updated_by: {type: ObjectId, ref: 'User'},
  deleted_on: Date,
  deleted_by: {type: ObjectId, ref: 'User'}
});

registerEvents(TemplateSchema);
export default mongoose.model('Template', TemplateSchema);
