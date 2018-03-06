import Collection from "./Collection";
import Mapping from "./Mapping";

export default class Model {
    constructor() {
        this.updateHash = this.updateHash.bind(this);
        this.handleDeletedPerson = this.handleDeletedPerson.bind(this);
        this.handleDeletedEvent = this.handleDeletedEvent.bind(this);
        this.handleDeletedTime = this.handleDeletedTime.bind(this);
        this.people = new Collection();
        this.people.onUpdate = this.updateHash;
        this.people.onRemove = this.handleDeletedPerson;
        this.events = new Collection();
        this.events.onUpdate = this.updateHash;
        this.events.onRemove = this.handleDeletedEvent;
        this.times = new Collection();
        this.times.onUpdate = this.updateHash;
        this.times.onRemove = this.handleDeletedTime;
        this.eventPeople = new Mapping();
        this.eventPeople.onUpdate = this.updateHash;
        this.eventTimes = new Mapping();
        this.eventTimes.onUpdate = this.updateHash;
        this.serializableCollections = [
            this.people,
            this.events,
            this.times
        ];
        this.serializableMappings = [
            this.eventPeople,
            this.eventTimes
        ];
        this.tabs = [2, 1]; // times, events
        if (window.location.hash && window.location.hash.length > 3) {
            this.loadHash();
        }
        this.onChange = null;
        this.solver = null;
    }

    loadHash() {
        const tabs = window.location.hash.substr(1, 2);
        this.tabs = [
            tabs.charCodeAt(0) - '0'.charCodeAt(0),
            tabs.charCodeAt(1) - '0'.charCodeAt(0)
        ];
        const str = window.location.hash.substr(3);
        const collections = str.split("/");
        if (this.serializableCollections.length + this.serializableMappings.length === collections.length) {
            for (let i = 0; i < collections.length; ++i) {
                if (i < this.serializableCollections.length) {
                    this.serializableCollections[i].clear();
                    collections[i].split("&").forEach(item => {
                        if (item !== "") {
                            this.serializableCollections[i].append(decodeURIComponent(item));
                        }
                    });
                } else {
                    this.serializableMappings[i - this.serializableCollections.length].clear();
                    collections[i].split("&").forEach(item => {
                        if (item !== "") {
                            let arr = item.split(",");
                            const key1 = parseInt(arr[0], 10);
                            arr.splice(0, 1);
                            arr.forEach(key2 => {
                                if (key2 !== "") {
                                    this.serializableMappings[i - this.serializableCollections.length].set(key1, parseInt(key2, 10));
                                }
                            })
                        }
                    });
                }
            }
        }
    }

    updateHash() {
        let hash = `#${this.tabs[0]}${this.tabs[1]}`;
        this.serializableCollections.forEach((collection, i) => {
            if (i > 0) {
                hash += "/";
            }
            hash += collection.array.map(encodeURIComponent).join("&");
        });
        this.serializableMappings.forEach(mapping => {
            hash += "/" + mapping.listKey1().map(key1 => {
                let arr = [key1];
                arr.push(mapping.listKey2(key1));
                return arr.join(",");
            }).join("&");
        });
        window.location.hash = hash;
        if (this.onChange) {
            this.onChange();
        }
        if (this.solver) {
            this.solver.handleModelUpdate();
        }
    }

    handleDeletedPerson(i) {
        this.eventPeople.removeKey2(i);
    }

    handleDeletedEvent(i) {
        this.eventPeople.removeKey1(i);
        this.eventTimes.removeKey1(i);
    }

    handleDeletedTime(i) {
        this.eventTimes.removeKey2(i);
    }
}
