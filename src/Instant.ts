import { ModelEvent, DateDate } from './ModelEvent'
import { deepClone, Cloneable } from './utils'

// TODO: Test and document this properly

/**
 * A single point in time.
 * Instants should not be modified by either
 */
export interface Instant<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> {
  date: DateDate /* date of this instants */
  description?: Description /* description of this instant */

  events: Array<ModelEvent<Description, User, FormalReason>> /* events that make up this instant */

  users: { [user: string]: User } /* user data */
  usersChanged: string[] /* changed users */

  roles: { [role: string]: number } /* defined roles in the board */
  rolesChanged: string[] /* roles that have been changed in this instant */

  members: { [key: string]: string[] } /* assignment of roles -> persons */
}

/** Create a new instant based on an optional previous instant */
export function NewInstant<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> (date: DateDate, initial?: Instant<Description, User, FormalReason>): Instant<Description, User, FormalReason> {
  const { roles, members, users } = initial ?? { roles: {}, members: {}, users: {} }

  return {
    date,
    events: [],

    roles: deepClone(roles),
    rolesChanged: [],

    users: deepClone(users),
    usersChanged: [],

    members: deepClone(members)
  }
}
