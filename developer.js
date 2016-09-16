const uuid = require('node-uuid')
const randgen = require('randgen')
const range = require('lodash.range')

const DEVELOPER_STATE_BUSY = 'busy'
const DEVELOPER_STATE_IDLE = 'idle'
const DEVELOPER_STATE_REST = 'rest'

// TODO: re-factor module to either OOP or Functional style

// random developer's experience [0.1 .. 1]
// 0.1 - lowest experience level, 1 - highest experience level
const experience = () => randgen.rlist(range(0.1, 1.1, 0.1))

// random rest time in minutes with mean 20 minutes
const estimateRestTime = () => {
  const mean = 20
  const deviation = 20
  let restTime = randgen.rnorm(mean, deviation)

  if (restTime < 0) {
    restTime = 1
  } else if (restTime > 60) {
    restTime = 60
  }

  return Math.floor(restTime)
}

// TODO: move this calculation to a separate module
const estimateWorkTime = (dev, task) => {
  const min = -0.5
  const max = 1.5
  const timeRandomisation = Math.floor(Math.random() * (max - min + 1)) + min
  const time = (task.difficulty / dev.experience + timeRandomisation) * 60
  return Math.floor(time)
}

exports.rest = (dev) => {
  if (dev.state == DEVELOPER_STATE_BUSY) {
    dev.doneTasks.push(dev.task)
    dev.task = null
    dev.state = DEVELOPER_STATE_REST
    dev.restingTimeOut = estimateRestTime()
    return
  }

  if (dev.restingTimeOut > 0) {
    dev.restingTimeOut--
    dev.restTimeTotal++
  } else {
    dev.state = DEVELOPER_STATE_IDLE
  }
  dev.idleTimeTotal++
}

exports.startTask = (dev, task) => {
  dev.state = DEVELOPER_STATE_BUSY
  dev.task = task
  dev.workingTimeOut = estimateWorkTime(dev, task)
}

exports.work = (dev) => {
  if (dev.workingTimeOut == 0) {
    exports.rest(dev)
    return
  }

  dev.workingTimeOut--
}

exports.idle = (dev) => dev.idleTimeTotal++

exports.generate = (givenExperience) => ({
  id: uuid.v4(),
  experience: givenExperience || experience(),
  // TODO: there should be only one time out which depends on stateß
  restingTimeOut: 0, // shows how many minutes left to rest
  workingTimeOut: 0, // shows how many minutes developer will be working
  task: null,
  state: DEVELOPER_STATE_IDLE,
  // TODO: move data accumulators to a separate module
  idleTimeTotal: 0,
  restTimeTotal: 0,
  doneTasks: []
})

exports.seedDevs = (capacity) => {
  let devs = []
  let i = capacity

  while (i--) {
    devs.push(exports.generate())
  }

  return devs
}

exports.DEVELOPER_STATE_BUSY = DEVELOPER_STATE_BUSY
exports.DEVELOPER_STATE_IDLE = DEVELOPER_STATE_IDLE
exports.DEVELOPER_STATE_REST = DEVELOPER_STATE_REST
