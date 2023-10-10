import { Caliber } from './Caliber'

export class Item {
    constructor(
        public name: string,
        public label: string,
        public flavor_text: string,
        public type: string,
        public sprite_y?: number,
        public sprite_x?: number,
        public caliber?: Caliber,
        public capacity?: number
    ) {
        this.name = name;
        this.label = label;
        this.type = type;
        this.sprite_y = sprite_y;
        this.sprite_x = sprite_x;
        this.caliber = caliber;
        this.capacity = capacity;
    }
}