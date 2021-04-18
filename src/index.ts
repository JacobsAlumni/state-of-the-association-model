import { compareEvent, ModelEvent, DateDate, compareDateDate } from "./ModelEvent";
import { Instant, NewInstant } from "./Instant";
import { Reduce } from "./Reduce";

/** Continuum represens a mutable continuum of events */
export class Continuum<Description, User, FormalReason> {
    private events = new Array<ModelEvent<Description, User, FormalReason>>();

    /*
        Event adds an event to the continuum.
        Events do not have to be added in order.
    */
    public add(event: ModelEvent<Description, User, FormalReason>) {
        this.events.push(event);
    }

    /**
     * Compile parses the current state of the continuum into a timeline.
     * 
     * @returns
     */
    public compile(): Timeline<Description, User, FormalReason> {
        const compiler = new TimelineCompiler<Description, User, FormalReason>();
        return compiler.compile(this.events);
    }
}

/**
 * TimelineCompiler creates a Timeline from a list of events
 */
class TimelineCompiler<Description, User, FormalReason> {
    compile(events: Array<ModelEvent<Description, User, FormalReason>>): Timeline<Description, User, FormalReason> {      
        this.instants = new Array<Instant<Description, User, FormalReason>>();
        this.currentInstant = NewInstant<Description, User, FormalReason>("");
        
        events.slice(0)
            .sort(compareEvent)
            .forEach(this.reduce.bind(this));
        
        this.finalizeInstant();

        return new Timeline(this.instants);
    }

    // state of the machinery
    private instants: Array<Instant<Description, User, FormalReason>> = undefined!;
    private currentInstant: Instant<Description, User, FormalReason> = undefined!;

    /**
     * Reduce applies event to the current state.
     * Events *must* be applied in order of compareEvent.
    */
    private reduce(event: ModelEvent<Description, User, FormalReason>) {
        // ensure that we have an event that is later than the current events!
        const comparison = compareDateDate(event.date, this.currentInstant.date);
        if (comparison < 0) throw new Error("Timeline.reduce: ActiveEvent passed in wrong order");
        
        // if we have a newer event, create a new instant!
        if (comparison > 0) this.finalizeInstant(event.date);

        // and apply the actual instant!
        Reduce(this.currentInstant, event);
    }

    /**
     * FinalizeInstant finializes the current instant
     * @param nextDate 
     */
    private finalizeInstant(nextDate?: DateDate) {
        // create a new instant and move it over
        const nextInstant = NewInstant(nextDate ?? "", this.currentInstant);
        this.instants.push(this.currentInstant);
        this.currentInstant = nextInstant;
    }
}

/**
 * Timeline represents a static timeline of events.
 */
export class Timeline<Description, User, FormalReason> {

    constructor(instants: Array<Instant<Description, User, FormalReason>>) {
        const map = new Map<DateDate, Instant<Description, User, FormalReason>>();

        instants.forEach(instant => {
            map.set(instant.date, Object.freeze(instant));
        });

        this.instants = Object.freeze(map);
    }

    public readonly instants: Readonly<Map<DateDate, Instant<Description, User, FormalReason>>>;

    // TODO: Optimize these methods using some kind of caching!
    // E.g. we could compile them at the end of the constructor!

    /* getInstants gets all instants */
    public getInstants(): Readonly<Array<DateDate>> {
        return Array.from(this.instants.keys());
    }

    /* getInstant gets an instant with a specific date or undefined */
    public getInstant(date: DateDate): Instant<Description, User, FormalReason> | undefined {
        return this.instants.get(date);
    }
}
