import { Continuum } from './index'
import { Instant } from './Instant'
import { EventKind, ModelEvent } from './ModelEvent'
import { Cloneable } from './utils'

describe(Continuum, () => {
  const tests: Array<{
    name: string
    events: Array<ModelEvent<Cloneable, Cloneable, Cloneable>>
    results: Array<Instant<Cloneable, Cloneable, Cloneable>>
  }> = [{
    name: 'generates an empty timeline containing only one instant',
    events: [],
    results: [
      {
        date: '',
        events: [],
        roles: {},
        rolesChanged: [],
        users: {},
        usersChanged: [],
        members: {}
      }
    ]
  }, {
    name: 'generates a simple timeline',
    events: [
      {
        date: '',

        kind: EventKind.Role,
        role: 'example'
      },

      {
        date: '',

        kind: EventKind.SetUser,
        user: 'temp',
        data: true
      },

      {
        date: '',

        kind: EventKind.SetUser,
        user: 'temp2',
        data: true
      },

      {
        date: '2020-01-01',

        kind: EventKind.EnterRole,
        role: 'example',
        user: 'temp',

        reason: {
          kind: 'legal',
          description: true
        }
      },

      {
        date: '2020-01-02',

        kind: EventKind.LeaveRole,
        role: 'example',
        user: 'temp',

        reason: {
          kind: 'legal',
          description: true
        }
      },

      {
        date: '2020-01-02',

        kind: EventKind.EnterRole,
        role: 'example',
        user: 'temp2',

        reason: {
          kind: 'legal',
          description: true
        }
      },

      {
        date: '2020-01-02',

        kind: EventKind.DeleteUser,
        user: 'temp'
      }
    ],
    results: [
      {
        date: '',
        events: [
          {
            date: '',
            kind: EventKind.Role,
            role: 'example'
          },
          {
            date: '',
            kind: EventKind.SetUser,
            user: 'temp',
            data: true
          },
          {
            date: '',
            kind: EventKind.SetUser,
            user: 'temp2',
            data: true
          }
        ],
        roles: {
          example: 1
        },
        rolesChanged: [
          'example'
        ],
        users: {
          temp: true,
          temp2: true
        },
        usersChanged: [
          'temp',
          'temp2'
        ],
        members: {
          example: []
        }
      },
      {
        date: '2020-01-01',
        events: [
          {
            date: '2020-01-01',
            kind: EventKind.EnterRole,
            role: 'example',
            user: 'temp',
            reason: {
              kind: 'legal',
              description: true
            }
          }
        ],
        roles: {
          example: 1
        },
        rolesChanged: [],
        users: {
          temp: true,
          temp2: true
        },
        usersChanged: [],
        members: {
          example: [
            'temp'
          ]
        }
      },
      {
        date: '2020-01-02',
        events: [
          {
            date: '2020-01-02',
            kind: EventKind.LeaveRole,
            role: 'example',
            user: 'temp',
            reason: {
              kind: 'legal',
              description: true
            }
          },
          {
            date: '2020-01-02',
            kind: EventKind.DeleteUser,
            user: 'temp'
          },
          {
            date: '2020-01-02',
            kind: EventKind.EnterRole,
            role: 'example',
            user: 'temp2',
            reason: {
              kind: 'legal',
              description: true
            }
          }
        ],
        roles: {
          example: 1
        },
        rolesChanged: [],
        users: {
          temp2: true
        },
        usersChanged: [
          'temp'
        ],
        members: {
          example: [
            'temp2'
          ]
        }
      }
    ]
  }]

  tests.forEach(({ name, events, results }) => {
    it(name, () => {
      const continuum = new Continuum()
      events.forEach(continuum.add.bind(continuum))

      const timeline = continuum.compile()
      // console.log(JSON.stringify(timeline, null, 2)) // to generate new test case output
      expect(Array.from(timeline)).toStrictEqual(results)
    })
  })
})
