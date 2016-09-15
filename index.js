const task = require('./task')
const developer = require('./developer')

const {
  DEVELOPER_STATE_IDLE,
  DEVELOPER_STATE_BUSY,
  DEVELOPER_STATE_REST } = developer

const DEVS_POOL_CAPACITY = 5
const TASKS_POOL_CAPACITY = 25
const SIMULATION_STEPS = 9600 // 9600 minutes = 20 working days

const getTaskFromPool = (pool) => {
  if (!pool || !pool.length) {
    return -1
  }

  let maxIdx = 0
  let maxVal = pool[ maxIdx ]
  if (maxVal == 1) {
    return maxIdx
  }

  for (let i = 1; i < pool.length; i++) {
    if (pool[ i ] > maxVal) {
      maxVal = pool[ i ]
      maxIdx = i

      if (maxVal == 1) {
        return maxIdx
      }
    }
  }

  return maxIdx
}

const step = (step, tasks, devs) => {
  devs.forEach(dev => {
    switch (dev.state) {
      case DEVELOPER_STATE_BUSY: {
        developer.work(dev)
        break
      }
      case DEVELOPER_STATE_IDLE: {
        const taskIdx = getTaskFromPool(tasks)
        if (taskIdx > -1) {
          const task = tasks.splice(taskIdx, 1)
          developer.startTask(dev, task[ 0 ])
        } else {
          developer.idle(dev)
        }
        break
      }
      case DEVELOPER_STATE_REST: {
        developer.rest(dev)
        break
      }
      default:
        throw new Error(`Unknown developer state ${dev.state}`)
    }
  })
  /* eslint-disable no-console */
  console.log(`STEP: ${step}`)
  console.log(devs)
  console.log(tasks.length)
  console.log('==============')
  /* eslint-enable no-console */
}

const run = (simulationSteps, tasks, devs) => {
  let currentStep = simulationSteps
  while (currentStep--) {
    step(simulationSteps - currentStep, tasks, devs)
  }
}

let tasksPool = task.seedTasks(TASKS_POOL_CAPACITY)
let devs = developer.seedDevs(DEVS_POOL_CAPACITY)

run(SIMULATION_STEPS, tasksPool, devs)

/* eslint-disable no-console */
console.log('RESULTS')
devs.forEach((dev, i) => {
  let avgDifficulty = dev.doneTasks.reduce((res, task) => {
    return res + task.difficulty
  }, 0)

  if (dev.doneTasks.length) {
    avgDifficulty = Math.round(avgDifficulty * 100 / dev.doneTasks.length) / 100
  } else {
    avgDifficulty = 0
  }

  console.log(`Developer:${i} - experience: ${dev.experience}\t
    idle time total: ${dev.idleTimeTotal} (includes rest time)\t
    rest time total: ${dev.restTimeTotal}\t
    tasks done: ${dev.doneTasks.length}\t
    average difficulty: ${avgDifficulty}\n`)
})
/* eslint-enable no-console */
