import { Vector } from "Vector";
import { MainDesignerController } from "./MainDesignerController";

export class ScopePopupController {
    private scopeDiv: HTMLDivElement;
    private scopeCanvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private xSize: number = 300;
    private ySize: number = 150;

    public constructor(main: MainDesignerController) {
        let testArray: Vector[] = [new Vector(5, -5), new Vector(6, 6), new Vector(7, 7), 
                new Vector(8, 8), new Vector(9, 9), new Vector(10, 12), new Vector(11, 20)]

        const canvas = main.getCanvas();
        this.scopeDiv = <HTMLDivElement>document.getElementById("scope-view");
        this.scopeCanvas = <HTMLCanvasElement>document.getElementById("scope-canvas");
        this.context = this.scopeCanvas.getContext("2d");
        this.scopeDiv.style.left = "500px";
        this.scopeDiv.style.top = "200px";
        this.setUpGraph();
        this.plotData(testArray);
        this.show();
    }

    public show(): void {
        this.scopeDiv.classList.remove("invisible");
    }
    
    public hide(): void {
        this.scopeDiv.classList.add("invisible");
    }


    public plotData(vecArray: Vector[] | null): void {
        let xMin: number = Math.min(...vecArray.map(vec => vec.x));
        xMin = xMin - Math.abs(xMin) * 0.05;
        let xMax: number = Math.max(...vecArray.map(vec => vec.x));
        xMax = xMax * 1.05;
        let yMin: number = Math.min(...vecArray.map(vec => vec.y));
        yMin = yMin - Math.abs(yMin) * 0.05;
        let yMax: number = Math.max(...vecArray.map(vec => vec.y));
        yMax = yMax * 1.05;

        console.log("xMin", xMin, "yMin", yMin);

        let yRange: number = yMax - yMin;
        let xRange: number = xMax - xMin;

        vecArray.sort((v1, v2) => v1.x - v2.x);

        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.moveTo(this.mapCoord(vecArray[0].x-xMin, xRange, this.xSize), this.ySize - this.mapCoord(vecArray[0].y-yMin, yRange, this.ySize));
        for (let i = 1; i < vecArray.length; i++) {
            this.context.lineTo(this.mapCoord(vecArray[i].x-xMin, xRange, this.xSize), this.ySize - this.mapCoord(vecArray[i].y-yMin, yRange, this.ySize));
        }
        this.context.stroke();
    }

    private mapCoord(originalCoord: number, maxValue: number, canvasSize: number): number{
        return ((originalCoord / maxValue) * canvasSize);
    }

    private setUpGraph() {
        this.context.beginPath();
        this.context.lineWidth = 4;
        this.context.moveTo(0, 0)
        this.context.lineTo(0, 150);
        this.context.lineTo(300, 150);
        this.context.stroke();

        this.context.beginPath();
        this.context.lineWidth = 0.5;
        for (let i = 25; i < 300; i += 25) {
            this.context.moveTo(0, i);
            this.context.lineTo(290, i);
        }
        this.context.stroke();
    }
}