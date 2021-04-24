import { Cloneable, compareStrings } from './utils'

/** Any event supported by this package */
export type ModelEvent<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> =
  InstantEvent<Description> |

  RoleEvent |

  SetUserEvent<User> |
  DeleteUserEvent |

  EnterRoleEvent<FormalReason> |
  LeaveRoleEvent<FormalReason>

/** A (formal) description to the current instant */
export interface InstantEvent<Description extends Cloneable> extends ModelEventPrototype<EventKind.Instant> {
  description: Description
}

/** create or update user data */
export interface SetUserEvent<User> extends ModelEventPrototype<EventKind.SetUser> {
  user: string
  data: User
}

/** delete a user along with their data */
export interface DeleteUserEvent extends ModelEventPrototype<EventKind.DeleteUser> {
  user: string
}

/** Create or Delete a Role in the board */
export interface RoleEvent extends ModelEventPrototype<EventKind.Role> {
  role: string
  max?: number /* maximum number of occupants of this role, default 1, to delete set <= 0 */
}

/** Assign a user to a specific role */
export interface EnterRoleEvent<FormalReason extends Cloneable> extends ModelEventPrototype<EventKind.EnterRole> {
  role: string
  user: string
  reason: Reason<FormalReason>
}

/** Unassign a user from a specific role */
export interface LeaveRoleEvent<FormalReason extends Cloneable> extends ModelEventPrototype<EventKind.LeaveRole> {
  role: string
  user: string
  reason: Reason<FormalReason>
}

/** Base used for every kind of event */
interface ModelEventPrototype<Kind extends EventKind> {
  kind: Kind
  date: DateDate
}

/** Reason is a legal reason for entering or leaving a position */
type Reason<FormalReason extends Cloneable> = LegalReason<FormalReason> | ElectionReason<FormalReason> | AppointmentReason<FormalReason>

/** Required for legal reasons, e.g. person left association */
interface LegalReason<FormalReason extends Cloneable> extends ReasonPrototype<'legal', FormalReason> {
}

/** Person was elected by association members */
interface ElectionReason<FormalReason extends Cloneable> extends ReasonPrototype<'election', FormalReason> {
  votes: Record<string, number>
  abstensions: number
}

/** Person was appointed by board members */
interface AppointmentReason<FormalReason extends Cloneable> extends ReasonPrototype<'appointment', FormalReason> {
  votes: {
    yes: number
    no: number
  }
  abstensions: number
}

/** Base for all reasons */
interface ReasonPrototype<K extends string, Description> {
  kind: K
  description: Description
}

/** Represents the Kinds of Events used by this package */
export enum EventKind {
  Instant = 'instant',

  Role = 'role',

  EnterRole = 'enter',
  LeaveRole = 'leave',

  SetUser = 'user',
  DeleteUser = 'deleteUser',

}

const eventKindOrder: EventKind[] = [
  EventKind.Instant, // description of the current event, so that error messages are right

  EventKind.LeaveRole, // members leave first, so that they can 'move' to a different position
  EventKind.DeleteUser, // remove users

  EventKind.Role, // update / remove role

  EventKind.SetUser, // update / remove user data
  EventKind.EnterRole // member was elected or appointed
]

/* DateDate represents a time represented by a "YYYY-MM-DD" string. The empty DateDate represents a time before all others. */
export type DateDate = string | ''

/**
 * Compares events based on when they occur.
 * Within the same data, events are ordered by kind-specific semantics.
 *
 * @param a First event to compare
 * @param b Second event to compare
 * @returns a positive number when a occured first, a negative number when b occured first, or 0 when they occured at the same time.
 */
export function compareEvent<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> (a: ModelEvent<Description, User, FormalReason>, b: ModelEvent<Description, User, FormalReason>): number {
  const dates = compareDateDate(a.date, b.date)
  if (dates !== 0) return dates

  // sort by eventKindOrder
  return eventKindOrder.indexOf(a.kind) - eventKindOrder.indexOf(b.kind)
}

/**
 *
 * @param a First Date to compare
 * @param b Second Date to compare
 * @returns a positive number when a occured first, a negative number when b occured first, or 0 when they occured at the same time.
 */
export function compareDateDate (a: DateDate, b: DateDate): number {
  return compareStrings(a, b)
}
