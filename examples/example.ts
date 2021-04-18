import { Continuum } from "..";
import { ModelEvent } from "../src/ModelEvent";

const cont = new Continuum();

const events: Array<ModelEvent<string, true, true>> = [
    {
        date: "",

        kind: "role",
        role: "example",
    },

    {
        date: "",

        kind: "user",
        user: "temp",
        data: true,
    },

    {
        date: "",

        kind: "user",
        user: "temp2",
        data: true,
    },





    {
        date: "2020-01-01",
    
        kind: "enter",
        role: "example",
        user: "temp",
        
        reason: {
            kind: "legal",
            description: true,
        }
    },



    

    {
        date: "2020-01-02",
    
        kind: "leave",
        role: "example",
        user: "temp",
        
        reason: {
            kind: "legal",
            description: true,
        }
    },

    {
        date: "2020-01-02",

        kind: "enter",
        role: "example",
        user: "temp2",
        
        reason: {
            kind: "legal",
            description: true,
        }
    },

    {
        date: "2020-01-02",

        kind: "deleteUser",
        user: "temp",
    }
]
events.forEach(cont.add.bind(cont));

const timeline = cont.compile();
timeline.getInstants().forEach(i => {
    const instant = timeline.getInstant(i);
    console.log("instant", instant);
})