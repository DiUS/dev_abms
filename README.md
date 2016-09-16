# dev_abms
Agent Based Modelling System of software development process

# Agents
## Developer
Developer agent has the following properties:
* `id` unique identifier of developer
* `experience` developer experience in interval [0.1 .. 1] \(highest value
means highest experience level\)
* `state` developer's state, can be one of the following values:
  * `busy` developer is working at task
  * `idle` developer is not working at any task or resting
  * `rest` developer has a timeout between tasks
* `task` the task developer is working at now
* `workingTimeOut` time left to done task
* `restingTimeOut` time left to rest
* `idleTimeTotal` accumulates total idle time (includes rest time)
* `restTimeTotal` accumulates total rest time
* `doneTasks` accumulates done tasks

When create new developer agent it's possible to set experience or let the system
automatically generate it. Normal distribution law is used to generate random
experience value on interval [0.1 .. 1]

After developer finished task he should have some timeout to rest. Resting timeout
is a random value with normal distribution on interval [1 .. 60] with mean 20 minutes

Working timeout is calculated by the following formula:
```
T = (td / de + r) * 60
```
where
* `td` task difficulty
* `de` developer experience
* `r` random value on interval [-0.5 .. 1.5]

## Task
Task agent has the following properties:
* `id` unique identifier of task
* `difficulty` task difficulty in interval [1 .. 10] \(highest value means highest difficulty level\)
* `type` there are two types of tasks in the system:
  * `bug` with probability 0.6
  * `feature` with probability 0.4
* `priority` with value in interval [0.1 .. 1] \(highest value means highest level of priority\), random value with normal distribution
* `created` timestamp of task creation

# Environments
There are two environments available in the system:
* `waterfall`
* `agile`  

Every step of simulation process represents `one minute` of real world.
On every step the system looks for idle developers and assign new task (with highest priority) to them.
Every 8 to 20 hours system will generate new tasks.  
Amount of generated tasks is a random value with normal distribution in interval [5 .. 20] tasks.
The only difference between `agile` and `waterfall` environments is that in `agile` new tasks become available to idle developers as soon as created.  
In `waterfall` environment generated tasks added first to `TODO` pool (scheduling pool) and then only after 80 hours (10 days) become available to idle developers.

# List of generated random values
* developer experience
* estimate work time at task
* estimate rest time
* task difficulty
* task type distribution
* task priority
* new task generation time
* amount of generated tasks

# Usage
Execute the following command to install required dependencies
```
# npm i
```

As soon as dependencies installed you can run the following command to start modelling
```
# npm start <environment>
```

# TODO
* Re-factor developer module
* Assign tasks by priority and created timestamp
* Add CLI options
  * to turn on/off debug mode
  * to set custom task types probability values
  * to set simulation step amount
  * to set tasks pool capacity
  * to set developers pool capacity
* Add CLI help
