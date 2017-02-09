'use strict';

class PubSub {
  publish(topic, message) {
    errorNotImplemented();
  }

  subscribe(topic, callback, strategy='fanout') {
    errorNotImplemented();
  }
}


class InMemoryPubSub extends PubSub {
  constructor() {
    super();
    this.topics = new Map();
    this.nextUid = 0;
  }

  publish(topicName, message) {
    const topic = this._getTopic(topicName);
    for (const subscription of topic.values()) {
      try {
        subscription(message, () -> {});
      } catch (e) {
        defer(() => {throw e;});
      }
    }
  }

  subscribe(topicName, callback) {
    const topic = this._getTopic(topicName);
    const token = `${topicName}-${this.nextUid}`;
    this.nextUid++;
    topic.set(token, callback);
    return token;
  }

  unsubscribe(tokenOrCallback) {
    let found = false;
    for (const topic of this.topics.values()) {
      for (const [token, subscription] of topic.entries()) {
        if (tokenOrCallback === token || tokenOrCallback == subscription) {
          topic.delete(token);
          found = true;
        }
      }
    }
    if (!found) {
      errorInvalidSubscription();
    }
  }

  _getTopic(topicName) {
    if (!this.topics.has(topicName)) {
      this.topics.set(topicName, new Map());
    }
    return this.topics.get(topicName);
  }
}


class AwsPubSub extends PubSub {
  constructor() {
  }

  publish(message) {
  }

  subscribe(topic, callback) {
  }
}


function defer(fn) {
  setTimeout(fn, 0);
}


function errorNotImplemented() {
  throw new Error('Method not implemented');
}

function errorInvalidSubscription() {
  throw new Error('Invalid subscription');
}

module.exports = {
  InMemoryPubSub
}

