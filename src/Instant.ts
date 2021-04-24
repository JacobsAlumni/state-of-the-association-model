import { ModelEvent, DateDate } from './ModelEvent'
import { deepClone, Cloneable } from './utils'

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

  /** historic data about members */
  historicRecords: { [user: string]: Array<{role: string, from: string, until?: string}> }
}

/**
 * Creates a new Instant.
 * @param date Date the new instant should take place at
 * @param initial Optional instant representing a previous time
 * @returns a new instant, that potentially inherits from the old one
 */
export function NewInstant<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> (date: DateDate, initial?: Instant<Description, User, FormalReason>): Instant<Description, User, FormalReason> {
  const { roles, members, users, historicRecords: historicMembers } = initial ?? { roles: {}, members: {}, users: {}, historicRecords: {} }

  return {
    date,
    events: [],

    roles: deepClone(roles),
    rolesChanged: [],

    users: deepClone(users),
    usersChanged: [],

    members: deepClone(members),
    historicRecords: deepClone(historicMembers)
  }
}
