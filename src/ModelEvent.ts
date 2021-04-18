/**
 * A ModelEvent is any event supported by this model.
 */
export type ModelEvent<Description, User, FormalReason> =
    TakeRoleEvent<FormalReason> |
    LeaveRoleEvent<FormalReason> | 
    
    InstantEvent<Description> | 
    
    UpdateRoleEvent | 
    
    SetUserEvent<User> | 
    DeleteUserEvent;

/* A description of the current event, e.g. "General Assembly 2020" */
export interface InstantEvent<Description> extends ModelEventPrototype<"instant"> {
    description: Description;
}

/* creating or updating user data */
export interface SetUserEvent<User> extends ModelEventPrototype<"user"> {
    user: string;
    data: User;
}

/* delete a user */
export interface DeleteUserEvent extends ModelEventPrototype<"deleteUser"> {
    user: string;
}

/* Creating or updating a role */
export interface UpdateRoleEvent extends ModelEventPrototype<"role"> {
    role: string;
    max?: number; /* maximum number of occupants of this role, default 1, to delete set <= 0 */
}

/* An election of a specific person */
export interface TakeRoleEvent<FormalReason> extends ModelEventPrototype<"enter"> {
    role: string;
    user: string;
    reason: Reason<FormalReason>;
}

/* A removal of a specific person */
export interface LeaveRoleEvent<FormalReason> extends ModelEventPrototype<"leave"> {
    role: string;
    user: string;
    reason: Reason<FormalReason>;
}

/** EventPrimitive represents a primitive event */
interface ModelEventPrototype<K extends string> {
    date: DateDate;
    kind: K;
}

/** Reason is a legal reason for entering or leaving a position */
type Reason<FormalReason> = LegalReason<FormalReason> | ElectionReason<FormalReason> | AppointmentReason<FormalReason>;

/* Required for legal reasons, e.g. person left association */
interface LegalReason<FormalReason> extends ReasonPrototype<"legal", FormalReason> {
}

/* Person was elected by board members */
interface ElectionReason<FormalReason> extends ReasonPrototype<"election", FormalReason> {
    votes: Record<string, number>;
    abstensions: number;
}

/* Person was appointed */
interface AppointmentReason<FormalReason> extends ReasonPrototype<"appointment", FormalReason> {
    votes: {
        yes: number;
        no: number;
    },
    abstensions: number;
}

interface ReasonPrototype<K extends string, Description> {
    kind: K;
    description: Description;
}


const eventKindOrder: Array<ModelEvent<never, never, never>['kind']> = [
    "instant", // description of the current event, so that error messages are right

    "leave", // members leave first, so that they can 'move' to a different position
    "deleteUser", // remove users

    "role", // update / remove role

    "user", // update / remove user data
    "enter", // member was elected or appointed

];

/* DateDate represents a time represented by a "YYYY-MM-DD" string. The empty DateDate represents a time before all others. */
export type DateDate = string | "";

/* 
 * compareEvent compares a and b based on the time they occur.
 * Returns a positive number when a occured first, a negative number when b occured first, or 0 when they occured at the same time.
 * Within a specific time, events are ordered by kind.
 */
export function compareEvent<Description, User, FormalReason>(a: ModelEvent<Description, User, FormalReason>, b: ModelEvent<Description, User, FormalReason>) {
    const dates = compareDateDate(a.date, b.date);
    if (dates != 0) return dates;

    // sort by eventKindOrder
    return eventKindOrder.indexOf(a.kind) - eventKindOrder.indexOf(b.kind);
}
/* 

 * compareEvent compares a and b.
 * Returns a positive number when a occured first, a negative number when b occured first, or 0 when they occured at the same time.
 */
export function compareDateDate(a: DateDate, b: DateDate) {
    switch(true) {
    case a < b:
        return -1;
    case a > b:
        return 1;
    default:
        return 0;    
    }
}