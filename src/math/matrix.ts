import { Vector3 } from "./vec";

export class Mat3 {

    private _data: number[]; 

    constructor(data) {
        this._data = data;
    }

    static create(entries) {
        return new Mat3(entries);
    }

    transform(v1) {
        return Vector3.create(
            Vector3.dot(this.row(0), v1),
            Vector3.dot(this.row(1), v1),
            Vector3.dot(this.row(2), v1)
        );
    }

    row(i) {
        const indx = i * 3;
        return Vector3.create(
            this._data[indx + 0],
            this._data[indx + 1],
            this._data[indx + 2]
        );
    }

    static from(v1, v2, v3) {
        return Mat3.create([
            v1.x, v2.x, v3.x,
            v1.y, v2.y, v3.y,
            v1.z, v2.y, v3.z,
        ]);
    }
}
