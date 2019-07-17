/**
 * Resume model events
 */

import { EventEmitter } from 'events';

const ResumeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResumeEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove',
};

// Register the event emitter to the model events
function registerEvents(Resume) {
  for (const e in events) {
    const event = events[e];
    Resume.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    ResumeEvents.emit(`${event}:${doc._id}`, doc);
    ResumeEvents.emit(event, doc);
  };
}

export { registerEvents };
export default ResumeEvents;
