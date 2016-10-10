const randgen = require('randgen')
const range = require('lodash.range')

/**
 * This function calculates estimate work time based on developer's experience
 * and task difficulty
 *
 * @param {Object} options - options to calculate estimate work time
 * @param {number} options.devExperience - developer's experience
 * @param {number} options.taskDifficulty - task's difficulty
 * @param {number} options.min - minimum value of random coefficient of estimate
 * working time deviation
 * @param {number} options.max - maximum value of random coefficient of estimate
 * working time deviation
 * @return {number} estimate working time
 */
exports.estimateWorkTime = (options) => {
  let {devExperience, taskDifficulty, min = -0.5, max = 1.5} = options
  const timeRandomisation = Math.floor(Math.random() * (max - min + 1)) + min
  const time = (taskDifficulty / devExperience + timeRandomisation) * 60
  return Math.floor(time)
}

/**
 * This function calculates estimate developer's rest time between tasks
 *
 * @param {Object} options - options to calculate estimate rest time
 * @param {number} options.mean - mean of random rest time value
 * @param {number} options.deviation - deviation of random rest time value
 * @return {number} estimate rest time
 */
exports.estimateRestTime = (options) => {
  let {mean = 20, deviation = 20} = options
  let restTime = randgen.rnorm(mean, deviation)

  if (restTime < 0) {
    restTime = 1
  } else if (restTime > 60) {
    restTime = 60
  }

  return Math.floor(restTime)
}

/**
 * This function generates random developer experience value in interval [0.1 .. 1]
 * (highest value - highest experience)
 *
 * @return {number} experience value
 */
exports.devExperience = () => randgen.rlist(range(0.1, 1.1, 0.1))
