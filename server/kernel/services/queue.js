const Queue = require('bee-queue');

// shttps:// github.com/bee-queue/bee-queue#settings
exports.create = queueName => (new Queue(queueName, {
  prefix: process.env.QUEUE_PREFIX || 'queue',
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 1000,
  redis: {
    url: process.env.REDIS_URL || 'redis://redistogo:40a52946f72e2dd2ead1a02e30ac7e6c@porgy.redistogo.com:11749'
  },
  isWorker: true,
  getEvents: true,
  sendEvents: true,
  storeJobs: true,
  ensureScripts: true,
  activateDelayedJobs: false,
  removeOnSuccess: true,
  removeOnFailure: true
}));
