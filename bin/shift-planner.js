#!/usr/bin/env node
import arg from 'arg'
import { plan } from '../index.js'

class ParamError extends Error {
  constructor (...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParamError)
    }

    this.name = 'ParamError'
  }
}

const defaults = {
  '--days': 7,
  '--shifts-per-day': 1,
  '--participants-per-shift': 1
}

const args = arg({
  // Types
  '--participants': [String],
  '--days-to-plan': Number,
  '--shifts-per-day': Number,
  '--participants-per-shift': Number,

  // Aliases
  '-p': '--participants',
  '-d': '--days-to-plan',
  '-s': '--shifts-per-day',
  '-i': '--participants-per-shift'
})

const params = Object.assign({}, defaults, args)

const participants = params['--participants']
const daysToPlan = params['--days-to-plan']
const shiftsPerDay = params['--shifts-per-day']
const participantsPerShift = params['--participants-per-shift']

try {
  if (!participants) {
    throw new ParamError('no participants available')
  }

  if (participants.length < participantsPerShift) {
    throw new ParamError(
      'number of participants per shift is greater as the number of available participants'
    )
  }

  const { metaData, schedule } = plan({
    participants,
    daysToPlan,
    shiftsPerDay,
    participantsPerShift
  })

  console.log(metaData)
  console.log(JSON.stringify(schedule, null, 2))
} catch (e) {
  if (e instanceof ParamError) {
    console.log(e.message)
    process.exit(1)
  }

  throw e
}
