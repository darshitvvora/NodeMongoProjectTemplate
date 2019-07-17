/**
 * User model events
 */

import { EventEmitter } from 'events';

const UserEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove',
};

// Register the event emitter to the model events
function registerEvents(User) {
  for (const e in events) {
    const event = events[e];
    User.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    UserEvents.emit(`${event}:${doc._id}`, doc);
    UserEvents.emit(event, doc);
  };
}

export { registerEvents };
export default UserEvents;
