import { NewInstant } from './Instant'
import { EventKind } from './ModelEvent'

describe(NewInstant, () => {
  it('creates a blank instant when provided with only a blank date', () => {
    expect(NewInstant('')).toStrictEqual({
      date: '',
      events: [],
      members: {},
      roles: {},
      rolesChanged: [],
      users: {},
      usersChanged: []
    })
  })

  it('creates a blank instant when provided with only a non-blank date', () => {
    expect(NewInstant('2020-01-01')).toStrictEqual({
      date: '2020-01-01',
      events: [],
      members: {},
      roles: {},
      rolesChanged: [],
      users: {},
      usersChanged: []
    })
  })

  it('inherits from an old instant when provided with one', () => {
    expect(NewInstant('2020-01-01', {
      date: '2000-10-10',
      description: 'description',
      events: [{ kind: EventKind.Instant, date: '2000-10-10', description: 'description' }],
      members: { main: ['example'] },
      roles: { main: 1 },
      rolesChanged: [],
      users: { example: 'data' },
      usersChanged: []
    })).toStrictEqual({
      date: '2020-01-01',
      events: [],
      members: { main: ['example'] },
      roles: { main: 1 },
      rolesChanged: [],
      users: { example: 'data' },
      usersChanged: []
    })
  })
})
