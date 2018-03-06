export default class Mapping {
    constructor() {
        this.map = {};
        this.onUpdate = null;
    }

    fireUpdate() {
        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    clear() {
        this.map = {};
    }

    set(key1, key2) {
        this.map[key1] = this.map[key1] || [];
        if (this.map[key1].indexOf(key2) < 0) {
            this.map[key1].push(key2);
            this.fireUpdate();
        }
    }

    unset(key1, key2) {
        this.map[key1] = this.map[key1] || [];
        const i = this.map[key1].indexOf(key2);
        if (i >= 0) {
            this.map[key1].splice(i, 1);
            this.fireUpdate();
        }
    }

    lookup(key1, key2) {
        if (this.map[key1]) {
            return this.map[key1].indexOf(key2) >= 0;
        }
        return false;
    }

    listKey1() {
        return Object.getOwnPropertyNames(this.map).filter(key1 => this.map[key1].length > 0);
    }

    listKey2(key1) {
        return this.map[key1];
    }

    removeKey1(i) {
        this.listKey1().forEach(key => {
            if (key == i) {
                this.map[key] = [];
            } else if (key > i) {
                this.map[key - 1] = this.map[key];
                this.map[key] = [];
            }
        });
    }

    removeKey2(i) {
        this.listKey1().forEach(key1 => {
            let removeI = -1;
            this.map[key1].forEach((key2, ki) => {
                if (key2 == i) {
                    removeI = i;
                } else if (key2 > i) {
                    --this.map[key1][ki];
                }
            });
            if (removeI >= 0) {
                this.map[key1].splice(removeI, 1);
            }
        });
    }
}
