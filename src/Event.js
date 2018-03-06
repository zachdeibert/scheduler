import State from "./State";

export default class Event {
    constructor(id, model, people, clone = null) {
        if (clone) {
            this.model = clone.model;
            this.name = clone.name;
            this.id = clone.id;
            this.times = clone.times.splice(0);
            this.availableTimes = clone.availableTimes.splice(0);
            this.time = clone.time;
            this.nextGuess = 0;
        } else {
            this.model = model;
            this.name = model.events.get(id);
            this.id = id;
            this.times = model.times.array.map((time, i) => model.eventTimes.lookup(id, i) ? State.AVAILABLE : State.IMPOSSIBLE);
            this.availableTimes = model.times.array.map((time, i) => model.eventTimes.lookup(id, i) ? i : -1).filter(i => i >= 0);
            this.time = -1;
            this.nextGuess = 0;
        }
        this.people = people.filter(person => this.model.eventPeople.lookup(this.id, person.id));
        if (!clone) {
            this.people.forEach(person => this.availableTimes.forEach(time => person.addAvailableTime(time)));
        }
        this.people.forEach(person => person.addEvent(this));
    }

    isSolved() {
        return this.time >= 0;
    }

    canBeSolved() {
        return this.availableTimes.length > 0;
    }

    guess() {
        if (this.nextGuess >= this.availableTimes.length) {
            console.log(`Event ${this.name} has cycled through all the guesses.`);
            this.nextGuess = 0;
            return false;
        } else {
            console.log(`Event ${this.name} is going to be solved by guessing it will be at time ${this.availableTimes[this.nextGuess]}.`);
            this.solve(this.availableTimes[this.nextGuess++]);
            return true;
        }
    }

    makeImpossible(time) {
        this.times[time] = State.IMPOSSIBLE;
        const i = this.availableTimes.indexOf(time);
        if (i >= 0) {
            this.availableTimes.splice(i, 1);
        }
    }

    solve(time) {
        this.time = time;
        this.availableTimes.forEach(this.makeImpossible.bind(this));
        this.people.forEach(person => person.setEvent(this, time));
        this.times[time] = State.ASSIGNED;
    }

    trySolveWithLogic() {
        if (this.time >= 0) {
            return false;
        } else if (this.availableTimes.length === 1) {
            console.log(`Solving event ${this.name} by logic for time ${this.availableTimes[0]}.`);
            this.solve(this.availableTimes[0]);
            return true;
        } else {
            return false;
        }
    }
}
