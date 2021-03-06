const uuid = require('node-uuid')
const {estimateWorkTime, estimateRestTime, devExperience} = require('./randomUtils')

const DEVELOPER_STATE_BUSY = 'busy'
const DEVELOPER_STATE_IDLE = 'idle'
const DEVELOPER_STATE_REST = 'rest'

exports.rest = (dev) => {
  if (dev.state == DEVELOPER_STATE_BUSY) {
    return Object.assign({}, dev, {
      task: null,
      doneTasks: dev.doneTasks.concat(dev.task),
      state: DEVELOPER_STATE_REST,
      timeOut: estimateRestTime({})
    })
  }

  if (dev.timeOut > 0) {
    return Object.assign({}, dev, {
      timeOut: dev.timeOut - 1,
      restTimeTotal: dev.restTimeTotal + 1,
      idleTimeTotal: dev.idleTimeTotal + 1
    })
  }

  return Object.assign({}, dev, {
    state: DEVELOPER_STATE_IDLE,
    idleTimeTotal: dev.idleTimeTotal + 1
  })
}

exports.startTask = (dev, task) => {
  return Object.assign({}, dev, {
    state: DEVELOPER_STATE_BUSY,
    task: task,
    timeOut: estimateWorkTime({
      devExperience: dev.experience,
      taskDifficulty: task.difficulty
    })
  })
}

exports.work = (dev) => Object.assign({}, dev, {timeOut: dev.timeOut - 1})

exports.idle = (dev) => Object.assign({}, dev, {idleTimeTotal: dev.idleTimeTotal + 1})

exports.generate = (givenExperience) => ({
  id: uuid.v4(),
  experience: givenExperience || devExperience(),
  timeOut: 0,
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
