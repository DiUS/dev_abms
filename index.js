const task = require('./task')
const developer = require('./developer')

const {
  DEVELOPER_STATE_IDLE,
  DEVELOPER_STATE_BUSY,
  DEVELOPER_STATE_REST } = developer

const DEVS_POOL_CAPACITY = 5
const TASKS_POOL_CAPACITY = 100
const SIMULATION_STEPS = 9600 // 9600 minutes = 20 working days

const getTaskFromPool = (pool) => {
  if (!pool || !pool.length) {
    return
  }

  const min = 0
  const max = pool.length
  const i = Math.floor(Math.random() * (max - min + 1)) + min
  return pool[ i ]
}

const step = (tasks, devs) => {
  devs.forEach(dev => {
    switch (dev.state) {
      case DEVELOPER_STATE_BUSY: {
        developer.work(dev)
        break
      }
      case DEVELOPER_STATE_IDLE: {
        const task = getTaskFromPool(tasks)
        if (task) {
          developer.startTask(dev, task)
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
}

const run = (simulationSteps, tasks, devs) => {
  let currentStep = simulationSteps
  while (currentStep--) {
    step(tasks, devs)
  }
}

let tasksPool = task.seedTasks(TASKS_POOL_CAPACITY)
let devs = developer.seedDevs(DEVS_POOL_CAPACITY)

run(SIMULATION_STEPS, tasksPool, devs)
console.log(devs);
