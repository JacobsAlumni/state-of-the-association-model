import { compareEvent, compareDateDate, ModelEvent, EventKind } from './ModelEvent'
import { Cloneable } from './utils'

describe(compareDateDate, () => {
  // dates in ascending order to be compared
  const compareDateTests = [
    '',
    '2010-01-01',
    '2010-01-02',
    '2010-02-01',
    '2010-02-02',
    '2020-01-01',
    '2020-01-02',
    '2020-02-01',
    '2020-02-02'
  ]

  it('returns equal dates as 0', () => {
    compareDateTests.forEach(s => {
      expect(compareDateDate(s, s)).toBe(0)
    })
  })

  it('returns -1 when the first date is smaller', () => {
    for (let i = 0; i < compareDateTests.length; i++) {
      for (let j = i + 1; j < compareDateTests.length; j++) {
        expect(compareDateDate(compareDateTests[i], compareDateTests[j])).toBe(-1)
      }
    }
  })

  it('returns 1 when the second date is larger', () => {
    for (let i = 0; i < compareDateTests.length; i++) {
      for (let j = 0; j < i; j++) {
        expect(compareDateDate(compareDateTests[i], compareDateTests[j])).toBe(1)
      }
    }
  })
})

describe(compareEvent, () => {
  // events in ascending order to be compared
  const modelEventTests: Array<ModelEvent<Cloneable, Cloneable, Cloneable>> = [
    { kind: EventKind.Instant, date: '2000-10-10', description: 'description' },
    { kind: EventKind.LeaveRole, date: '2000-10-10', user: 'userid', role: 'roleid', reason: { kind: 'legal', description: 'description' } },
    { kind: EventKind.DeleteUser, date: '2000-10-10', user: 'userid' },
    { kind: EventKind.Role, date: '2000-10-10', role: 'roleid', max: 1 },
    { kind: EventKind.SetUser, date: '2000-10-10', user: 'userid', data: 'data' },
    { kind: EventKind.EnterRole, date: '2000-10-10', user: 'userid', role: 'roleid', reason: { kind: 'legal', description: 'description' } },

    { kind: EventKind.Instant, date: '2001-10-10', description: 'description' },
    { kind: EventKind.LeaveRole, date: '2001-10-10', user: 'userid', role: 'roleid', reason: { kind: 'legal', description: 'description' } },
    { kind: EventKind.DeleteUser, date: '2001-10-10', user: 'userid' },
    { kind: EventKind.Role, date: '2001-10-10', role: 'roleid', max: 1 },
    { kind: EventKind.SetUser, date: '2001-10-10', user: 'userid', data: 'data' },
    { kind: EventKind.EnterRole, date: '2001-10-10', user: 'userid', role: 'roleid', reason: { kind: 'legal', description: 'description' } }
  ]

  it('returns equal dates as 0', () => {
    modelEventTests.forEach(s => {
      expect(compareEvent(s, s)).toBe(0)
    })
  })

  it('returns negative number when the first event comes first', () => {
    for (let i = 0; i < modelEventTests.length; i++) {
      for (let j = i + 1; j < modelEventTests.length; j++) {
        expect(compareEvent(modelEventTests[i], modelEventTests[j])).toBeLessThan(0)
      }
    }
  })

  it('returns positive number when the second event comes first', () => {
    for (let i = 0; i < modelEventTests.length; i++) {
      for (let j = 0; j < i; j++) {
        expect(compareEvent(modelEventTests[i], modelEventTests[j])).toBeGreaterThan(0)
      }
    }
  })
})
