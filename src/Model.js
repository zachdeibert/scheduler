import Collection from "./Collection";

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
        this.serializableCollections = [
            this.people,
            this.events,
            this.times
        ];
        this.tabs = [2, 1]; // times, events
        if (window.location.hash && window.location.hash.length > 3) {
            this.loadHash();
        }
        this.onChange = null;
    }

    loadHash() {
        const tabs = window.location.hash.substr(1, 2);
        this.tabs = [
            tabs.charCodeAt(0) - '0'.charCodeAt(0),
            tabs.charCodeAt(1) - '0'.charCodeAt(0)
        ];
        const str = window.location.hash.substr(3);
        const collections = str.split("/");
        if (this.serializableCollections.length === collections.length) {
            for (let i = 0; i < this.serializableCollections.length; ++i) {
                this.serializableCollections[i].clear();
                collections[i].split("&").forEach(item => {
                    if (item !== "") {
                        this.serializableCollections[i].append(decodeURIComponent(item));
                    }
                });
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
        window.location.hash = hash;
        if (this.onChange) {
            this.onChange();
        }
    }

    handleDeletedPerson(i) {

    }

    handleDeletedEvent(i) {

    }

    handleDeletedTime(i) {

    }
}
