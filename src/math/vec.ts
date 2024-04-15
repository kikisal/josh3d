import { Mat2 } from "./matrix";

export class Vector3 {

    x: number;
    y: number;
    z: number;

    components: number = 3;
    
    static LABELS = ['x', 'y', 'z'];
    
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    scalarMul(s) {
        return Vector3.scalarMul(this, s);
    }

    minus(v: Vector3) {
        return  Vector3.diff(this, v);
    }

    sum(v: Vector3) {
        return Vector3.sum(this, v);
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

    components: number = 2;

    static LABELS = ['x', 'y'];

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    sumAll() {
        return this.x + this.y;
    }

    minus(v: Vector2) {
        return Vector2.diff(this, v);
    }
    
    scalarMul(s) {
        return Vector2.scalarMul(this, s);
    }

    sum(v: Vector2) {
        return Vector2.sum(this, v);
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


export function vec_argnzero(v: Vector3 | Vector2) {
    const labels = Object.keys(v);
    for (let i = 0; i < v.components; ++i)
        if (v[labels[i]] != 0)
            return i;

    return -1;
}


export type Vec = Vector2 | Vector3;

// return a*(p2-p1) + b*(p3-p1) + p1;
export function bariInterp(p1: Vec, p2: Vec, p3: Vec, a: number, b: number) : Vec {
    const q1 = p2.minus(p1 as any);
    const q2 = p3.minus(p1 as any);
    return ((q1.scalarMul(a) as any).sum(q2.scalarMul(b))).sum(p1 as any);
}


// maps r from one space to the other (usually to get baricentric coordinates)
export function bariCoordsMap(p1: Vector2, p2: Vector2, p3: Vector2, r: Vector2) {
  
    const result = Vector2.create(NaN, NaN); 

    const q1 = Vector2.diff(p2, p1);
    const q2 = Vector2.diff(p3, p1);

    const k = vec_argnzero(q1);

    
    if (k < 0)
        return result;

    const labels = ['x', 'y'];
    const label = labels[k];

    const rk  = r [label];
    const p1k = p1[label];
    const q1k = q1[label];
    const q2k = q2[label];

    const M1 = Mat2.create(
        [
            q2.x, q2.y,
            q1.x, q1.y
        ]
    );

    const det = M1.det();

    if (det == 0)
        return result;

    // intermediate vectors for computation
    const K1 = Vector2.create(q1.y, -q1.x);
    const K2 = Vector2.create(-q1.x*q1.y, q1.x);

    const D = Vector2.dot(K1, r) + Vector2.dot(K2, p1); 


    const beta      = D / det;
    const alphish   = det * (rk - p1k) - q2k * D;

    result.x = alphish / (q1k * det);
    result.y = beta;

    return result;
}