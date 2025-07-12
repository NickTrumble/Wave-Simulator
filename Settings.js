export default class Settings {
    constructor() {
        this.octavesIn = document.getElementById('octaves');
        this.persistenceIn = document.getElementById('persistence');
        this.rotationIn = document.getElementById('rotation');
        this.movementIn = document.getElementById('movement');
        this.seedIn = document.getElementById('seed');
        this.sizeIn = document.getElementById('size');
        this.tileWidthIn = document.getElementById('tilewidth');

        this.seedIn.value = Math.floor(Math.random() * 100);
    }

    get values() {
        return {
            octaves: this.octavesIn.value,
            persistence: this.persistenceIn.value,
            rotateSpeed: this.rotationIn.value / 1000,
            movement: this.movementIn.value / 1000,
            seed: this.seedIn.value,
            size: this.sizeIn.value,
            tileWidth: this.tileWidthIn.value
        };
    }

    get octaves() {
        return this.octavesIn.value;
    }

    get persistence() {
        return this.persistenceIn.value;
    }

    get rotateSpeed() {
        return this.rotationIn.value / 1000;
    }

    get movement() {
        return this.movementIn.value / 1000;
    }

    get seed() {
        return this.seedIn.value;
    }

    get size() {
        return this.sizeIn.value;
    }

    get tileWidth() {
        return this.tileWidthIn.value;
    }
    
    updateSeed(seed) {
        this.seedIn.value = seed;
    }
}
