import { Instant } from './Instant'
import { InstantEvent, LeaveRoleEvent, ModelEvent, TakeRoleEvent, UpdateRoleEvent, SetUserEvent, DeleteUserEvent } from './ModelEvent'
import { Cloneable } from './utils'

/*
 *    Reduce reduces an instant with an event.
 *    Reduce expects to be called in event order.
 */
export function Reduce<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> (instant: Instant<Description, User, FormalReason>, event: ModelEvent<Description, User, FormalReason>): void {
  instant.events.push(event)
  eventReducers[event.kind](instant, event as unknown as any)
}

type EventReducer<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable, Kind extends ModelEvent<Description, User, FormalReason>['kind']> = (instant: Instant<Description, User, FormalReason>, event: ModelEvent<Description, User, FormalReason> & { kind: Kind }) => void

const eventReducers: { [Kind in ModelEvent<never, never, never>['kind']]: EventReducer<any, any, any, Kind>} = {
  instant: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: InstantEvent<Description>) => {
    if (typeof instant.description === 'string') {
      throw new ReduceError(instant, event, 'Instant already has a description.')
    }
    instant.description = event.description
  },

  user: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: SetUserEvent<User>) => {
    const { user, data } = event

    if (instant.usersChanged.includes(user)) {
      throw new ReduceError(instant, event, 'User ' + JSON.stringify(user) + ' has already been modified in the same instant. ')
    }

    instant.usersChanged.push(user)
    instant.users[user] = data
  },

  deleteUser: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: DeleteUserEvent) => {
    const { user } = event

    // check that the user is defined
    if (!(user in instant.users)) {
      throw new ReduceError(instant, event, 'Unknown User ' + JSON.stringify(user) + '. ')
    }

    // check that the user is not in any role!
    for (const value of Object.values(instant.members)) {
      if (value.includes(user)) {
        throw new ReduceError(instant, event, 'User ' + JSON.stringify(user) + ' cannot be deleted because they occupy a role! ')
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete instant.users[user]
    instant.usersChanged.push(user)
  },

  role: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: UpdateRoleEvent) => {
    const { role, max = 1 } = event

    if (instant.rolesChanged.includes(role)) {
      throw new ReduceError(instant, event, 'Role ' + JSON.stringify(role) + ' has already been modified in the same instant. ')
    }

    instant.rolesChanged.push(role) // this role has been modified

    // delete the role!
    if (max <= 0) {
      if (!(role in instant.roles)) {
        throw new ReduceError(instant, event, 'Role ' + JSON.stringify(role) + ' can not be removed because it does not exist. ')
      }
      if (role in instant.roles) {
        throw new ReduceError(instant, event, 'Role ' + JSON.stringify(role) + ' can not be removed because there are members in the role. ')
      }
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete instant.roles[role]
      return
    }

    // ensure that there aren't too many members!
    if (role in instant.members && instant.members[role].length > max) {
      throw new ReduceError(instant, event, 'Role ' + JSON.stringify(role) + ' can not be altered because there are too many member(s) in the role.. ')
    }

    instant.roles[role] = max

    // create an empty role!
    if (!(role in instant.members)) {
      instant.members[role] = []
    }
  },

  enter: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: TakeRoleEvent<FormalReason>) => {
    const { role, user } = event

    // check that the role is defined
    const max = instant.roles[role]
    if (max === undefined) {
      throw new ReduceError(instant, event, 'Unknown Role ' + JSON.stringify(role) + '. ')
    }

    // check that the user is defined
    if (!(user in instant.users)) {
      throw new ReduceError(instant, event, 'Unknown User ' + JSON.stringify(user) + '. ')
    }

    // update the members in the role!
    const current = instant.members[role] ?? []
    if (current.includes(user)) {
      throw new ReduceError(instant, event, 'User ' + JSON.stringify(role) + ' cannot enter role ' + JSON.stringify(role) + ': User already in specified role. ')
    }

    current.push(user)

    // check that we have enough space!
    if (current.length > max) {
      throw new ReduceError(instant, event, 'Cannot enter role ' + JSON.stringify(role) + ': Not enough space in role. ')
    }

    // and store it again!
    instant.members[role] = current
  },

  leave: <Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable>(instant: Instant<Description, User, FormalReason>, event: LeaveRoleEvent<FormalReason>) => {
    const { role, user } = event

    // check that the role is defined
    const max = instant.roles[role]
    if (max === undefined) {
      throw new ReduceError(instant, event, 'Unknown Role ' + JSON.stringify(role) + '. ')
    }

    // check that the user is defined
    if (!(user in instant.users)) {
      throw new ReduceError(instant, event, 'Unknown User ' + JSON.stringify(user) + '. ')
    }

    // find where the member is in the role
    const current = instant.members[role] ?? []
    const index = current.indexOf(user)
    if (index < 0) {
      throw new ReduceError(instant, event, 'User ' + JSON.stringify(role) + ' cannot leave role ' + JSON.stringify(role) + ': Role not occupied by user. ')
    }

    current.splice(index, 1)

    instant.members[role] = current
  }
}

export class ReduceError<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> extends Error {
  constructor (instant: Instant<Description, User, FormalReason>, event: ModelEvent<Description, User, FormalReason>, message: string) {
    super('Invalid event ' + JSON.stringify(event.kind) + ' at time ' + JSON.stringify(instant.date) + ': ' + message)
  }
}
