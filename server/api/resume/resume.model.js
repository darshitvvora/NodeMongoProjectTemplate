import mongoose from 'mongoose';
import { registerEvents } from './resume.events';
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const ResumeSchema = new mongoose.Schema({
    user_id: {type: ObjectId, ref: 'User'},
    template_id: {type: ObjectId, ref: 'Template'},
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

registerEvents(ResumeSchema);
export default mongoose.model('Resume', ResumeSchema);
