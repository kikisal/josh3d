import { Vector3, Vector2, Mat3 } from '../src/math';
import { addMisc } from '../src/misc/misc';

addMisc('normal-mapping-test', (pass) => {
    
    pass();

    return () => {
        
        const p1      = Vector3.create(0, 0,  0);
        const p2      = Vector3.create(1, 0,  0);
        const p3      = Vector3.create(1, 0, -1);
        
        const u1      = Vector2.create(0, 0);
        const u2      = Vector2.create(1, 0);
        const u3      = Vector2.create(1, 1);
        
        const dp1     = Vector3.diff(p2, p1);
        const dp2     = Vector3.diff(p3, p1);
        
        const du1     = Vector2.diff(u2, u1);
        const du2     = Vector2.diff(u3, u1);
        
        const _n   = du1.y * du2.x - du1.x * du2.y;
        const etha = 1 / _n;
        
        const tangent = Vector3.scalarMul(
            Vector3.diff(
                Vector3.scalarMul(dp2, du1.y),
                Vector3.scalarMul(dp1, du2.y)
            ),
            etha
        );
        
        const biTangent = Vector3.scalarMul(
            Vector3.diff(
                Vector3.scalarMul(dp1, du2.x),
                Vector3.scalarMul(dp2, du1.x)
            ),
            etha
        );
        
        const n = Vector3.create(0, 0, 1);
        
        const mat = Mat3.from(tangent, biTangent, Vector3.create(0, 1, 0));
        
        console.log(mat);
    }
});