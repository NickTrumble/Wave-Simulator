export default class Renderer {
    constructor(ctx, state, settings, canvas) {
        this.ctx = ctx;
        this.state = state;
        this.settings = settings;
        this.canvas = canvas;
    }

    drawFrame = () => {
        if (!this.state.play)
            return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.state.noiseMap = this.generate2DNoise();
        this.state.angle += this.settings.rotateSpeed;
        this.state.pixelOffset.x += this.settings.movement;
        this.state.rMatrix = this.generateMatrix(this.state.angle);
        for (let i = 0; i < this.settings.size; i++) {
            for (let j = 0; j < this.settings.size; j++) {
                let points = [
                    this.pointCalc({ x: i, y: j }),
                    this.pointCalc({ x: i + 1, y: j }),
                    this.pointCalc({ x: i + 1, y: j + 1 }),
                    this.pointCalc({ x: i, y: j + 1 })
                ];
                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, points[0].y);
                for (let k = 1; k < points.length; k++) {
                    this.ctx.lineTo(points[k].x, points[k].y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            }
        }

        requestAnimationFrame(this.drawFrame);
    };

    generate2DNoise() {
        let array = Array.from({ length: this.settings.size + 1}, () => Array.from({ length: this.settings.size + 1 }, () => 0.5));
        for (let i = 0; i < this.settings.size + 1; i++) {
            for (let j = 0; j < this.settings.size + 1; j++) {
                array[i][j] = this.state.simplex.fractalNoise2D((i + this.state.pixelOffset.x) / 10,
                    (j + this.state.pixelOffset.y) / 10, this.settings.octaves, this.settings.persistence);
            }
        }
        return array;
    }

    pointCalc(V, half = this.settings.size / 2) {
        let xVec = V.x - half;
        let yVec = V.y - half;

        let transformedX = xVec * this.state.rMatrix.m11 + yVec * this.state.rMatrix.m21;
        let transformedY = xVec * this.state.rMatrix.m12 + yVec * this.state.rMatrix.m22;

        // Apply second transformation to scale and offset
        let X = transformedX * this.state.tileWidth * 0.5 + this.state.xOffset;
        let Y = transformedY * this.state.tileHeight * 0.25 + this.state.yOffset - this.state.noiseMap[V.x][V.y] * 100;

        return { x: X, y: Y };
    }

    generateMatrix(newangle = 75) {
        let rad = newangle / (2 * Math.PI);
        return {
            m11: Math.cos(rad), m21: Math.sin(rad),
            m12: -Math.sin(rad), m22: Math.cos(rad)
        };
    }
}
