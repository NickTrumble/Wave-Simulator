// simplex-noise.js
class SimplexNoise {
    constructor(seed = 0) {
        this.grad3 = [
            [1,1], [-1,1], [1,-1], [-1,-1],
            [1,0], [-1,0], [0,1], [0,-1]
        ];

        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            this.p[i] = i;
        }

        const random = this._makeRandom(seed);
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
        }

        this.perm = new Uint8Array(512);
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    noise2D(xin, yin) {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

        let n0, n1, n2;

        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;

        let i1, j1;
        if (x0 > y0) {
            i1 = 1; j1 = 0;
        } else {
            i1 = 0; j1 = 1;
        }

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;

        const ii = i & 255;
        const jj = j & 255;

        const gi0 = this.perm[ii + this.perm[jj]] % 8;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 8;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 8;

        const t0 = 0.5 - x0 * x0 - y0 * y0;
        const t1 = 0.5 - x1 * x1 - y1 * y1;
        const t2 = 0.5 - x2 * x2 - y2 * y2;

        n0 = (t0 < 0) ? 0 : (t0 * t0) * (t0 * t0) * this._dot(this.grad3[gi0], x0, y0);
        n1 = (t1 < 0) ? 0 : (t1 * t1) * (t1 * t1) * this._dot(this.grad3[gi1], x1, y1);
        n2 = (t2 < 0) ? 0 : (t2 * t2) * (t2 * t2) * this._dot(this.grad3[gi2], x2, y2);

        return 70.0 * (n0 + n1 + n2);
    }

    fractalNoise2D(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxAmplitude = 0;

        for (let i = 0; i < octaves; i++) {
            total += (this.noise2D(x * frequency, y * frequency) + 1) / 2 * amplitude; 
            maxAmplitude += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxAmplitude;
    }

    _dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }

    _makeRandom(seed) {
        let s = seed || 0;
        return function () {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }
}

window.SimplexNoise = SimplexNoise;
