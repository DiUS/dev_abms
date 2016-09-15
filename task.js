const uuid = require('node-uuid')

const TASK_TYPE_BUG = 'bug'
const TASK_TYPE_FEATURE = 'feature'

exports.TASK_TYPE_BUG = TASK_TYPE_BUG
exports.TASK_TYPE_FEATURE = TASK_TYPE_FEATURE

// 1 - 10, 1 - easiest task, 10 - hardest task
// use normal distribution to generate value
const difficulty = () => {
  return 1
}

// 40% features, 60% bugs
const type = () => {
  return TASK_TYPE_BUG
}

// 0 - 1, 0 - lowest priority, 1 - highest priority
// use normal distribution to generate value
const priority = () => {
  return 0
}

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
