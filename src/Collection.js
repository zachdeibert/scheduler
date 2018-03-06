export default class Collection {
    constructor() {
        this.array = [];
        this.onUpdate = null;
        this.onRemove = null;
    }

    fireUpdate() {
        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    fireRemoval(i) {
        if (this.onRemove) {
            this.onRemove(i);
        }
    }

    clear() {
        this.array = [];
        this.fireUpdate();
    }

    count() {
        return this.array.length;
    }

    get(i) {
        return this.array[i];
    }

    set(i, value) {
        this.array[i] = value;
        this.fireUpdate();
    }

    append(value) {
        this.array.push(value);
        this.fireUpdate();
    }

    remove(i) {
        this.array.splice(i, 1);
        this.fireRemoval(i);
        this.fireUpdate();
    }
}
