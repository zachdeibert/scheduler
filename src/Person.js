import State from "./State";

export default class Person {
    constructor(id, model, clone = null) {
        if (clone) {
            this.model = clone.model;
            this.name = clone.name;
            this.id = clone.id;
            this.times = clone.times.slice(0);
            this.availableTimes = clone.availableTimes.slice(0);
        } else {
            this.model = model;
            this.name = model.people.get(id);
            this.id = id;
            this.times = model.times.array.map(() => State.IMPOSSIBLE);
            this.availableTimes = [];
        }
        this.events = [];
    }

    addAvailableTime(time) {
        this.times[time] = State.AVAILABLE;
        if (this.availableTimes.indexOf(time) < 0) {
            this.availableTimes.push(time);
        }
    }

    addEvent(event) {
        this.events.push(event);
    }

    setEvent(event, time) {
        const i = this.availableTimes.indexOf(time);
        if (i >= 0) {
            this.availableTimes.splice(i, 1);
        }
        this.times[time] = event.id;
        this.events.forEach(ev => ev.makeImpossible(time));
    }
}
