const task = require('./src/task')
const developer = require('./src/developer')
const randgen = require('randgen')
const range = require('lodash.range')

const {
  DEVELOPER_STATE_IDLE,
  DEVELOPER_STATE_BUSY,
  DEVELOPER_STATE_REST } = developer

const DEVS_POOL_CAPACITY = 5
const TASKS_POOL_CAPACITY = 25
const SIMULATION_STEPS = 9600 // 9600 minutes = 20 working days

const DEBUG = false
const AGILE = 'agile'
const WATERFALL = 'waterfall'
const mode = process.argv[ 2 ]

if (mode !== WATERFALL && mode !== AGILE) {
  throw new Error(`Unknow mode ${mode}`)
}

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

const generateNewTasks = () => task.seedTasks(randgen.rlist(range(5, 21, 1)))

const devMapper = (dev, tasks) => {
  switch (dev.state) {
    case DEVELOPER_STATE_BUSY: {
      if (dev.timeOut == 0) {
        return developer.rest(dev)
      }
      return developer.work(dev)
    }
    case DEVELOPER_STATE_IDLE: {
      const taskIdx = getTaskFromPool(tasks)
      if (taskIdx > -1) {
        const task = tasks.splice(taskIdx, 1)
        return developer.startTask(dev, task[ 0 ])
      }
      return developer.idle(dev)
    }
    case DEVELOPER_STATE_REST: {
      return developer.rest(dev)
    }
    default:
      throw new Error(`Unknown developer state ${dev.state}`)
  }
}

const step = (step, tasks, devs) => {
  devs = devs.map(dev => devMapper(dev, tasks))

  if (DEBUG) {
    /* eslint-disable no-console */
    console.log(`STEP: ${step}`)
    console.log(devs)
    console.log('==============')
    /* eslint-enable no-console */
  }

  return devs
}

const run = (simulationSteps, tasks, devs) => {
  let currentStep = simulationSteps
  let newTasksArrival = currentStep - randgen.rlist(range(8 * 60, 21 * 60, 60))

  while (currentStep--) {
    if (newTasksArrival == currentStep) {
      if (mode == AGILE) {
        tasks = tasks.concat(generateNewTasks())
      } else {
        waterfallTasks = waterfallTasks.concat(generateNewTasks())
      }

      newTasksArrival = currentStep - randgen.rlist(range(8 * 60, 21 * 60, 60))
    }

    if (mode == WATERFALL && (currentStep % (80 * 60)) === 0) {
      tasks = tasks.concat(waterfallTasks.splice(0, TASKS_POOL_CAPACITY))
    }

    devs = step(simulationSteps - currentStep, tasks, devs)
  }

  return devs
}

let tasksPool = task.seedTasks(TASKS_POOL_CAPACITY)
let waterfallTasks = []
let devs = developer.seedDevs(DEVS_POOL_CAPACITY)

devs = run(SIMULATION_STEPS, tasksPool, devs)

/* eslint-disable no-console */
console.log(`RESULTS for mode: ${mode}`)
let totalTasksDone = 0

devs.forEach((dev, i) => {
  totalTasksDone += dev.doneTasks.length

  let avgDifficulty = dev.doneTasks.reduce((res, task) => {
    return res + task.difficulty
  }, 0)

  if (dev.doneTasks.length) {
    avgDifficulty = Math.round(avgDifficulty * 100 / dev.doneTasks.length) / 100
  } else {
    avgDifficulty = 0
  }

  console.log(`Developer:${i} - experience: ${Math.round(dev.experience * 100) / 100}\t
    idle time total: ${dev.idleTimeTotal} (includes rest time)\t
    rest time total: ${dev.restTimeTotal}\t
    tasks done: ${dev.doneTasks.length}\t
    average difficulty: ${avgDifficulty}\n`)
})
console.log(`Total tasks done: ${totalTasksDone}`)
/* eslint-enable no-console */
