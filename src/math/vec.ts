export class Vector3 {

    x: number;
    y: number;
    z: number;
    
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    scalarMul(s) {
        return Vector3.scalarMul(this, s);
    }

    sumAll() {
        return this.x + this.y + this.z;
    }

    len() {
        return Vector3.len(this);
    }

    normalize() {
        return Vector3.scalarMul(this, 1 / Vector3.len(this));
    }

    static create(x, y, z) {
        return new Vector3(x, y, z);
    }

    // operations
    static zero() {
        return Vector3.create(0, 0, 0);
    }

    static repeat(k) {
        return Vector3.create(k, k, k);
    }

    static ones() {
        return Vector3.repeat(1);
    }

    static neg(v) {
        return Vector3.create(-v.x, -v.y, -v.z);
    }

    static sum(v1, v2) {
        return Vector3.create(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    static diff(v1, v2) {
        return Vector3.sum(v1, Vector3.neg(v2));
    }
    
    static scalarMul(v1, s) {
        return Vector3.create(v1.x * s, v1.y * s, v1.z * s);
    }

    // component-wise mult
    static mul(v1, v2) {
        return Vector3.create(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z)
    }

    static dot(v1, v2) {
        return Vector3.mul(v1, v2).sumAll();
    }

    static cross(v1, v2) {
        return Vector3.create(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x  
        );
    }

    static len(v1) {
        return Math.sqrt(Vector3.dot(v1, v1));
    }
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    sumAll() {
        return this.x + this.y;
    }

    normalize() {
        return Vector2.scalarMul(this, 1 / Vector2.len(this));
    }

    static create(x, y) {
        return new Vector2(x, y);
    }

    // operations
    static zero() {
        return Vector2.create(0, 0);
    }

    static repeat(k) {
        return Vector2.create(k, k);
    }

    static ones() {
        return Vector2.repeat(1);
    }

    static neg(v) {
        return Vector2.create(-v.x, -v.y);
    }

    static sum(v1, v2) {
        return Vector2.create(v1.x + v2.x, v1.y + v2.y);
    }

    static diff(v1, v2) {
        return Vector2.sum(v1, Vector2.neg(v2));
    }
    
    static scalarMul(v1, s) {
        return Vector2.create(v1.x * s, v1.y * s);
    }

    // component-wise mult
    static mul(v1, v2) {
        return Vector2.create(v1.x * v2.x, v1.y * v2.y)
    }

    static dot(v1, v2) {
        return Vector2.mul(v1, v2).sumAll();
    }

    static len(v1) {
        return Math.sqrt(Vector2.dot(v1, v1));
    }
}
