import { ModelEvent, DateDate, InstantEvent, TakeRoleEvent, LeaveRoleEvent, UpdateRoleEvent } from "./ModelEvent";

/*
    An instant represents a single point in time.
    Instants must not be mutated outside of the Timeline class.
*/
export interface Instant<Description, User, FormalReason> {
    date: DateDate; /* date of this instants */
    description?: Description;  /* description of this instant */
    
    events: Array<ModelEvent<Description, User, FormalReason>>; /* events that make up this instant */

    users: Record<string, User>; /* user data */
    usersChanged: Array<string>; /* changed users */

    roles: Record<string, number>; /* defined roles in the board */
    rolesChanged: Array<string>; /* roles that have been changed in this instant */

    members: Record<string, string[]>; /* assignment of roles -> persons */
}

/** Create a new instant based on an optional previous instant */
export function NewInstant<Description, User, FormalReason>(date: DateDate, initial?: Instant<Description, User, FormalReason>): Instant<Description, User, FormalReason> {
    const { roles, members, users } = initial ?? { roles: {}, members: {}, users: {} };

    return {
        date,
        events: [],

        roles: clone(roles),
        rolesChanged: [],

        users: clone(users),
        usersChanged: [],

        members: clone(members),
    }
}



/* clone clones a serializable object */
function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}