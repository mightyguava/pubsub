'use strict';

const pubsub = require('./pubsub.js');
const instance = new pubsub.InMemoryPubSub();

const token = instance.subscribe('foo', (message) => {
  console.log(`Got message ${message}`);
})

for (var i = 0; i < 5; i++) {
  instance.publish('foo', i);
}

instance.unsubscribe(token);
instance.publish('foo', 9);
