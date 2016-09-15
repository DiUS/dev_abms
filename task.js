const uuid = require('node-uuid')
const randgen = require('randgen')
const range = require('lodash.range')
const times = require('lodash.times')
const constant = require('lodash.constant')

const TASK_TYPE_BUG = 'bug'
const TASK_TYPE_FEATURE = 'feature'

exports.TASK_TYPE_BUG = TASK_TYPE_BUG
exports.TASK_TYPE_FEATURE = TASK_TYPE_FEATURE

// 40% features, 60% bugs
const features = times(4, constant(TASK_TYPE_FEATURE))
const bugs = times(6, constant(TASK_TYPE_BUG))
const fAndB = [].concat(features, bugs)

// 1 - 10, 1 - easiest task, 10 - hardest task
// use normal distribution to generate value
const difficulty = () => randgen.rlist(range(1, 11, 1))

const type = () => randgen.rlist(fAndB)

// 0 - 1, 0 - lowest priority, 1 - highest priority
// use normal distribution to generate value
const priority = () => randgen.rlist(range(0.1, 1.1, 0.1))

exports.generate = () => ({
  id: uuid.v4(),
  difficulty: difficulty(),
  type: type(),
  priority: priority(),
  created: Date.now()
})

exports.seedTasks = (capacity) => {
  let tasks = []
  let i = capacity

  while (i--) {
    tasks.push(exports.generate())
  }

  return tasks
}
