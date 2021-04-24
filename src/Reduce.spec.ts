import { Instant } from './Instant'
import { EventKind, ModelEvent } from './ModelEvent'
import { Reduce } from './Reduce'
import { Cloneable, deepClone } from './utils'

describe(Reduce, () => {
  const tests: Array<{
    name: string
    instant: Instant<Cloneable, Cloneable, Cloneable>
    event: ModelEvent<Cloneable, Cloneable, Cloneable>
    result?: Instant<Cloneable, Cloneable, Cloneable>
  }> = [

    /* InstantEvent */
    {
      name: 'can add an event description',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.Instant, description: 'description' },
      result: {
        date: '',
        description: 'description',
        events: [{ date: '', kind: EventKind.Instant, description: 'description' }],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      }
    },
    {
      name: 'can not add a second event description',
      instant: {
        date: '',
        description: 'description',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.Instant, description: 'description' }
    },

    /* SetUserEvent */
    {
      name: 'can create a new user',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.SetUser, user: 'example', data: 'data' },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.SetUser, user: 'example', data: 'data' }],
        users: {
          example: 'data'
        },
        usersChanged: ['example'],
        roles: {},
        rolesChanged: [],
        members: {}
      }
    },
    {
      name: 'can not create a deleted user',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: ['example'],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.SetUser, user: 'example', data: 'data' }
    },
    {
      name: 'can update an existing user',
      instant: {
        date: '',
        events: [],
        users: { example: 'old-data' },
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.SetUser, user: 'example', data: 'data' },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.SetUser, user: 'example', data: 'data' }],
        users: {
          example: 'data'
        },
        usersChanged: ['example'],
        roles: {},
        rolesChanged: [],
        members: {}
      }
    },
    {
      name: 'can not update an already modified user',
      instant: {
        date: '',
        events: [],
        users: { example: 'old-data' },
        usersChanged: ['example'],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.SetUser, user: 'example', data: 'data' }
    },

    /* DeleteUserEvent */
    {
      name: 'can delete an existing user',
      instant: {
        date: '',
        events: [],
        users: { example: 'old-data' },
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.DeleteUser, user: 'example' },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.DeleteUser, user: 'example' }],
        users: {},
        usersChanged: ['example'],
        roles: {},
        rolesChanged: [],
        members: {}
      }
    },

    {
      name: 'can not delete a non-existing user',
      instant: {
        date: '',
        events: [],
        users: { example: 'old-data' },
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.DeleteUser, user: 'example2' }
    },

    {
      name: 'can not delete a user with a role',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: {
          main: ['example']
        }
      },
      event: { date: '', kind: EventKind.DeleteUser, user: 'example' }
    },

    /* UpdateRoleEvent */

    {
      name: 'can create a new role (with default value)',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.Role, role: 'main' },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.Role, role: 'main' }],
        users: {},
        usersChanged: [],
        roles: {
          main: 1
        },
        rolesChanged: ['main'],
        members: {
          main: []
        }
      }
    },

    {
      name: 'can not create a deleted role',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: ['main'],
        members: {}
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 0 }
    },

    {
      name: 'can create a new role (with explicit value)',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 10 },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.Role, role: 'main', max: 10 }],
        users: {},
        usersChanged: [],
        roles: {
          main: 10
        },
        rolesChanged: ['main'],
        members: {
          main: []
        }
      }
    },

    {
      name: 'can not create a deleted role (with explicit value)',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: ['main'],
        members: {}
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 10 }
    },

    {
      name: 'can not delete non-existent role',
      instant: {
        date: '',
        events: [],
        users: {},
        usersChanged: [],
        roles: {},
        rolesChanged: [],
        members: {}
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 0 }
    },

    {
      name: 'can update a role to contain more seats than available',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: ['example'] }
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 2 },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.Role, role: 'main', max: 2 }],
        users: { example: 'data' },
        usersChanged: [],
        roles: {
          main: 2
        },
        rolesChanged: ['main'],
        members: {
          main: ['example']
        }
      }
    },

    {
      name: 'can update a role to contain less seats than available',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example'] }
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 1 },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.Role, role: 'main', max: 1 }],
        users: { example: 'data' },
        usersChanged: [],
        roles: {
          main: 1
        },
        rolesChanged: ['main'],
        members: {
          main: ['example']
        }
      }
    },

    {
      name: 'can not update a role to contain less seats than filled',
      instant: {
        date: '',
        events: [],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example', 'example2'] }
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 1 }
    },

    {
      name: 'can not delete a role with filled seats',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: ['example'] }
      },
      event: { date: '', kind: EventKind.Role, role: 'main', max: 0 }
    },

    /* TakeRoleEvent */

    {
      name: 'can take a role that has free seats',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: [] }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: ['example'] }
      }
    },

    {
      name: 'can take a role when already in other role',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1, sub: 1 },
        rolesChanged: [],
        members: { main: [], sub: ['example'] }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1, sub: 1 },
        rolesChanged: [],
        members: { main: ['example'], sub: ['example'] }
      }
    },

    {
      name: 'can take a role that already has a member',
      instant: {
        date: '',
        events: [],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example2'] }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example2', 'example'] }
      }
    },

    {
      name: 'can take a role that already has enough members',
      instant: {
        date: '',
        events: [],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: ['example2'] }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }
    },

    {
      name: 'can not take a role that a user is already in',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example'] }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }
    },

    {
      name: 'can not take a non-existent role',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { },
        rolesChanged: [],
        members: { }
      },
      event: { date: '', kind: EventKind.EnterRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }
    },

    /* LeaveRoleEvent */

    {
      name: 'can leave a role',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: ['example'] }
      },
      event: { date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1 },
        rolesChanged: [],
        members: { main: [] }
      }
    },

    {
      name: 'can leave a role staying in another',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1, sub: 1 },
        rolesChanged: [],
        members: { main: ['example'], sub: ['example'] }
      },
      event: { date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data' },
        usersChanged: [],
        roles: { main: 1, sub: 1 },
        rolesChanged: [],
        members: { main: [], sub: ['example'] }
      }
    },

    {
      name: 'can leave a role leaving another member',
      instant: {
        date: '',
        events: [],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example2', 'example'] }
      },
      event: { date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } },
      result: {
        date: '',
        events: [{ date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example2'] }
      }
    },

    {
      name: 'can leave a role that a user is not in',
      instant: {
        date: '',
        events: [],
        users: { example: 'data', example2: 'data' },
        usersChanged: [],
        roles: { main: 2 },
        rolesChanged: [],
        members: { main: ['example2'] }
      },
      event: { date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }
    },

    {
      name: 'can not leave a non-existent role',
      instant: {
        date: '',
        events: [],
        users: { example: 'data' },
        usersChanged: [],
        roles: { },
        rolesChanged: [],
        members: { }
      },
      event: { date: '', kind: EventKind.LeaveRole, role: 'main', user: 'example', reason: { kind: 'legal', description: 'none' } }
    }

  ]

  tests.forEach(({ name, instant, event, result }) => {
    it(name, () => {
      const theInstant = deepClone<any>(instant) as Instant<Cloneable, Cloneable, Cloneable>

      if (result !== undefined) {
        Reduce(theInstant, event)
        expect(theInstant).toStrictEqual(result)
      } else {
        expect(() => Reduce(theInstant, event)).toThrow()
      }
    })
  })
})
