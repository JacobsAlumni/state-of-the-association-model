import { compareEvent, ModelEvent, DateDate, compareDateDate } from './ModelEvent'
import { Instant, NewInstant } from './Instant'
import { Reduce } from './Reduce'
import { Cloneable } from './utils'

/** An (unordered) stream of Events */
export class Continuum<
  Description extends Cloneable,
  User extends Cloneable,
  FormalReason extends Cloneable
> {
  private readonly events = new Array<ModelEvent<Description, User, FormalReason>>()

  /**
   * Adds an event to this continuum.
   * @param event Event to add
   */
  public add (event: ModelEvent<Description, User, FormalReason>): void {
    this.events.push(event)
  }

  /** Compiles the current set of events into a timeline */
  public compile (): Timeline<Description, User, FormalReason> {
    return TimelineCompiler.compile(this.events)
  }
}

/**
 * Represents the current state of a timeline
 */
interface TimelineState<Description extends Cloneable, User extends Cloneable, FormalReason extends Cloneable> {
  instants: Array<Instant<Description, User, FormalReason>>
  currentInstant: Instant<Description, User, FormalReason>
}

/**
 * Implements Continuum.compile()
 */
const TimelineCompiler = {
  /**
   * Compile a list of events into a timeline
   * @param events
   * @returns
   */
  compile<
    Description extends Cloneable,
    User extends Cloneable,
    FormalReason extends Cloneable
  >(
    events: Array<ModelEvent<Description, User, FormalReason>>
  ): Timeline<Description, User, FormalReason> {
    const state: TimelineState<Description, User, FormalReason> = {
      instants: [],
      currentInstant: NewInstant('')
    }

    events.slice(0)
      .sort(compareEvent)
      .forEach(this.reduce.bind(this, state))

    this.finalizeInstant(state)

    return new Timeline(state.instants)
  },

  /**
     * Reduce applies event to the current state.
     * Events *must* be applied in order of compareEvent.
    */
  reduce<
    Description extends Cloneable,
    User extends Cloneable,
    FormalReason extends Cloneable
  >(
    state: TimelineState<Description, User, FormalReason>,
    event: ModelEvent<Description, User, FormalReason>
  ): void {
    // ensure that we have an event that is later than the current events!
    const comparison = compareDateDate(event.date, state.currentInstant.date)
    if (comparison < 0) throw new Error('Timeline.reduce: ActiveEvent passed in wrong order')

    // if we have a newer event, create a new instant!
    if (comparison > 0) TimelineCompiler.finalizeInstant(state, event.date)

    // and apply the actual instant!
    Reduce(state.currentInstant, event)
  },

  /**
     * FinalizeInstant finializes the current instant
     * @param nextDate
     */
  finalizeInstant<
    Description extends Cloneable,
    User extends Cloneable,
    FormalReason extends Cloneable
  >(
    state: TimelineState<Description, User, FormalReason>,
    nextDate?: DateDate
  ): void {
    // create a new instant and move it over
    const nextInstant = NewInstant(nextDate ?? '', state.currentInstant)
    state.instants.push(state.currentInstant)
    state.currentInstant = nextInstant
  }
}

/**
 * Timeline represents a static timeline of events.
 */
export class Timeline<
  Description extends Cloneable,
  User extends Cloneable,
  FormalReason extends Cloneable
> extends Array<Instant<Description, User, FormalReason>> {
  constructor (instants: Array<Instant<Description, User, FormalReason>>) {
    super(...instants)

    const map = new Map<DateDate, Instant<Description, User, FormalReason>>()

    instants.forEach(instant => {
      map.set(instant.date, Object.freeze(instant))
    })

    this.instants = Object.freeze(map)
  }

  public readonly instants: Readonly<Map<DateDate, Instant<Description, User, FormalReason>>>

  /**
   * Returns a list of all dates of all instants
   * @returns a list of dates for all instants
   */
  public getInstants (): Readonly<DateDate[]> {
    return Array.from(this.instants.keys())
  }

  /**
   * Gets an instant with a specific date, or undefined
   * @param date Date of instant to find
   * @returns the instant or undefined
   */
  public getInstant (date: DateDate): Instant<Description, User, FormalReason> | undefined {
    return this.instants.get(date)
  }
}
