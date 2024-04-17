import { Vector3, Vector2, Mat3, bariInterp, bariCoordsMap, IVector3, IVector2 } from '../src/math';
import { addMisc } from '../src/misc/misc';

class Fragment {

    private _position: Vector3;
    private _color: Vector3;
    private _discard: boolean;

    private _localIndx:  Vector2;
    private _globalIndx: Vector2;

    constructor(pos?: Vector3, col?: Vector3) {
        this._position = pos;
        this._color    = col;
        this._discard  = false;

        this._localIndx  = Vector2.zero();
        this._globalIndx = Vector2.zero();
    }

    setLocalIndex(i: number, j: number) {
        this._localIndx.x = j;
        this._localIndx.y = i;
    }

    localIndex() {
        return this._localIndx;
    }
    
    globalIndex() {
        return this._globalIndx;
    }
    

    // in the frame buffer
    setGlobalIndex(i: number, j: number) {
        this._globalIndx.x = j;
        this._globalIndx.y = i; 
    }
    

    setColor(color: Vector3) {
        this._color = color;
    }

    discard(state: boolean) {
        this._discard = state;
    }

    discardFragment() {
        return this._discard;
    }

    get position() {
        return this._position;
    }

    get color() {
        return this._color;
    }
}

class BoundingBox {

    private _pos: Vector2;
    private _size: Vector2;

    constructor(pos: Vector2, size: Vector2) {
        this._pos  = pos;
        this._size = size;
    }

    width() {
        return this.size.x;
    }

    height() {
        return this.size.y;
    }

    get pos() {
        return this._pos;
    }

    get size() {
        return this._size;
    }
}

interface IVertex {
    pos: IVector3;
    col: IVector3;
    uv:  IVector2;
};

interface ITriangle {
    v1: IVertex;
    v2: IVertex;
    v3: IVertex;
}

class Vertex implements IVertex {
    pos: IVector3;
    col: IVector3;
    uv: Vector2;

    constructor(pos: IVector3, col: IVector3, uv?: Vector2) {
        this.pos = pos;
        this.col = col;
        this.uv  = uv;
    }
}

class Triangle implements ITriangle {
    v1: IVertex;
    v2: IVertex;
    v3: IVertex;

    constructor(v1: IVertex, v2: IVertex, v3: IVertex) {
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }
}

function computeBoundingBox(p1: IVector2, p2: IVector2, p3: IVector2) {
    const minX = Math.floor(Math.min(p1.x, p2.x, p3.x));
    const minY = Math.floor(Math.min(p1.y, p2.y, p3.y));
    
    const maxX = Math.ceil(Math.max(p1.x, p2.x, p3.x));
    const maxY = Math.ceil(Math.max(p1.y, p2.y, p3.y));

    return new BoundingBox(Vector2.create(minX, minY), Vector2.create(maxX - minX, maxY - minY));
}

function getColorIndicesForCoord(x: number, y: number, width) {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  };

function imageSetColor(image: ImageData, color: Vector3, location: Vector2) {
    const indx = getColorIndicesForCoord(location.x, image.height - location.y, image.width);

    if (!color)
        return;
    
    image.data[indx[0]] = color.x * 255;
    image.data[indx[1]] = color.y * 255;
    image.data[indx[2]] = color.z * 255;
    image.data[indx[3]] = 255;
}


function drawFragments(frameBuffer, fragments: Fragment[], boundingBox: BoundingBox) {
    const ctx = frameBuffer;

    try {

        const image = ctx.createImageData(boundingBox.width(), boundingBox.height());
        
        for (let i = 0; i < fragments.length; ++i) {
            const frag = fragments[i];

            const pixelPos = Vector2.create(Math.floor(frag.position.x), Math.floor(frag.position.y)); 

            if (!frag.discardFragment()) {
                imageSetColor(image, frag.color, frag.localIndex());
            }
        }
        

        ctx.save();
        ctx.drawImage(imagedata_to_image(image), boundingBox.pos.x, boundingBox.pos.y + (frameBuffer.canvas.height - image.height));
    } catch(ex) {

    }
    //ctx.putImageData(image, );


    
    ctx.restore();
}

function imagedata_to_image(imagedata) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);
    return canvas;
}

interface ITextureListener {
    onLoad(): void;
}

class Texture {

    private  _url: string;
    private _data: ImageData;

    private _width:  number;
    private _height: number;

    private _listener: ITextureListener;

    constructor(url, listener?: ITextureListener) {
        this._url       = url;
        const img       = new Image();
        this._data      = null;
        this._listener  = listener;
        img.src         = url;
        img.onload      = this.onLoad.bind(this);
    }

    setListener(listener) {
        this._listener = listener;
    }

    onLoad(e) {
        const canvas = document.createElement('canvas');
        const ctx    = canvas.getContext('2d');
        const img = e.target;

        canvas.width  = img.width;
        canvas.height = img.height;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);
        this._data   = ctx.getImageData(0, 0, img.width, img.height);
        this._width  = img.width;
        this._height = img.height;

        if (this._listener)
            this._listener.onLoad();
    }

    sample(x: number, y: number) {
        if (!this._data)
            return Vector3.zero();

        const indices = getColorIndicesForCoord(Math.floor(x * this.width), Math.floor((1-y) * this.height), this.width);
        

        return Vector3.create(
            this._data.data[indices[0]] / 255,
            this._data.data[indices[1]] / 255,
            this._data.data[indices[2]] / 255
        );
    }

    
    get url()  { return this._url; };
    get data() { return this._data; };
    
    get width()  { return this._width; };
    get height() { return this._height; };

}

class ResListener implements ITextureListener {
    constructor() {

    }

    onLoad(): void {
        console.log("res listener: ONLOAD");
        draw();
    }
}

const resListener = new ResListener();

const mainCanvas      = document.createElement('canvas');
const mainFrameBuffer = mainCanvas.getContext('2d'); 

mainCanvas.width = 800;
mainCanvas.height = 800;


const faces = [
    {
        v1: {
            pos: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        v2: {
            pos: {
                x: 0,
                y: 0,
                z: 0
            },
        },
        v3: {
            pos: {
                x: 0,
                y: 0,
                z: 0
            },
        },
        v4: {
            pos: {
                x: 0,
                y: 0,
                z: 0
            },
        }
    },
    
]

function sampleFromImage(coord: Vector2, texture: Texture) {
    return texture.sample(coord.x, coord.y);
}

function drawTriangles(triangles: Triangle[]) {

    for (const trng of triangles) {

        const [p1, p2, p3]       = [trng.v1.pos.toVec2(), trng.v2.pos.toVec2(), trng.v3.pos.toVec2()];
        const [col1, col2, col3] = [trng.v1.col, trng.v2.col, trng.v3.col];
        const [uv1, uv2, uv3]    = [trng.v1.uv, trng.v2.uv, trng.v3.uv];

        const boundingBox = computeBoundingBox(p1, p2, p3);


        let fragments = [];
    
        for (let i = 0; i < boundingBox.height(); ++i)
        {
            for (let j = 0; j < boundingBox.width(); ++j) {
                const fragPos = Vector3.create(j + boundingBox.pos.x + .5, i + boundingBox.pos.y + .5, 0);// sample point
                const A = bariCoordsMap(p1, p2, p3, fragPos);

                const fragment = new Fragment(fragPos, null);

                fragment.setLocalIndex(i, j);
                fragment.setGlobalIndex(i + boundingBox.pos.y, j + boundingBox.pos.x);
                
                if (A.x >= 0 && A.y >= 0 && A.y + A.x <= 1) {
                    
                    // interpolated col attribute
                    const col = bariInterp(col1, col2, col3, A.x, A.y); 

                    // interpolated uv attribute
                    const uvCoord = bariInterp(uv1, uv2, uv3, A.x, A.y);

                    fragment.setColor(Vector3.create(uvCoord.x, uvCoord.y, 0));
                    
                    fragment.discard(false);
                }

                fragments.push(fragment);
            }
        }
        
        drawFragments(mainFrameBuffer, fragments, boundingBox);
    }
}

function draw() {
    mainFrameBuffer.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    drawTriangles(triangles);
    
}

addMisc('baricentric-test', (pass) => {

    return () => {
        document.body.appendChild(mainCanvas);
        draw();
    }
});