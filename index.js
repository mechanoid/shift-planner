import table from 'tty-table'
import { shuffle } from './lib/util.js'

const bootstrapSchedule = (days, shifts) => {
  const schedule = { days: [] }

  for (let day = 0; day < days; day++) {
    schedule.days.push({ shifts: [] })
    for (let shift = 0; shift < shifts; shift++) {
      schedule.days[day].shifts[shift] = []
    }
  }

  return schedule
}

const pick = (markers, count) => {
  console.log(markers)
}

// { days: [
//   { shifts: [ 'Participant' ]}
// ]}
const generate = ({
  participants,
  daysToPlan,
  shiftsPerDay,
  participantsPerShift,
  shifts
}) => {
  const schedule = bootstrapSchedule(daysToPlan, shiftsPerDay)
  const markers = []
  const participantCandidates = shuffle(participants)

  for (let i = 0; i < shifts; i++) {
    const pickIndex = i % participantCandidates.length
    const pick = participantCandidates[pickIndex]
    markers[pickIndex] = markers[pickIndex] || []
    markers[pickIndex].push(pick)
  }

  for (let day = 0; day < daysToPlan; day++) {
    for (let shift = 0; shift < shiftsPerDay; shift++) {
      const s = schedule.days[day].shifts[shift]
      pick(markers, participantsPerShift).map(s.push)
    }
  }

  return schedule
}

export const plan = ({
  participants = [],
  daysToPlan,
  shiftsPerDay,
  participantsPerShift
}) => {
  const shifts = daysToPlan * shiftsPerDay * participantsPerShift

  const metaData = table(
    [
      { value: 'MetaData', width: 20, align: 'left' },
      { value: 'Value', width: 20 }
    ],
    [
      ['Days', daysToPlan],
      ['Shifts per Day', shiftsPerDay],
      ['Participants per Shift', participantsPerShift],
      ['Shifts', shifts]
    ]
  ).render()

  const schedule = generate({
    participants,
    daysToPlan,
    shiftsPerDay,
    participantsPerShift,
    shifts
  })

  return { metaData, schedule }
}
