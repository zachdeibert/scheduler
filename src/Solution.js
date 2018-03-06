import Event from "./Event";
import Person from "./Person";

export default class Solution {
    constructor(model, clone = null) {
        if (clone) {
            this.model = clone.model;
            this.people = clone.people.map(person => new Person(null, null, person));
            this.events = clone.events.map(event => new Event(null, null, this.people, event));
            this.nextGuess = clone.nextGuess;
            this.lastSuccessfulGuess = clone.lastSuccessfulGuess;
            this.parent = clone;
        } else {
            this.model = model;
            this.people = model.people.array.map((person, i) => new Person(i, model));
            this.events = model.events.array.map((event, i) => new Event(i, model, this.people));
            this.nextGuess = 0;
            this.lastSuccessfulGuess = 0;
            this.parent = null;
        }
    }

    isSolved() {
        const val = this.events.filter(event => !event.isSolved()).length === 0;
        if (val) {
            console.log("Solution is complete.");
        }
        return val;
    }

    canBeSolved() {
        return this.events.filter(event => !event.isSolved() && !event.canBeSolved()).length === 0;
    }

    amountSolved() {
        return this.events.filter(event => event.isSolved()).length;
    }

    guess() {
        while (true) {
            const event = this.events[this.nextGuess % this.events.length];
            if (event.isSolved()) {
                ++this.nextGuess;
                if (this.parent) {
                    ++this.parent.nextGuess;
                }
            } else if (event.guess()) {
                this.lastSuccessfulGuess = this.nextGuess;
                if (this.parent) {
                    this.parent.lastSuccessfulGuess = this.nextGuess;
                }
                return true;
            } else if (++this.nextGuess - this.lastSuccessfulGuess > this.events.length) {
                if (this.parent) {
                    ++this.parent.nextGuess;
                }
                return false;
            } else if (this.parent) {
                ++this.parent.nextGuess;
            }
        }
    }

    trySolveWithLogic() {
        return this.events.filter(event => event.trySolveWithLogic()).length > 0;
    }

    getEvent(personId, timeId) {
        const person = this.people.find(person => person.id === personId);
        const eventId = person.times[timeId];
        if (eventId < 0) {
            return "";
        } else {
            return this.events.find(event => event.id === eventId).name;
        }
    }
}
