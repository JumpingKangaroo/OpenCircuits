import { Vector } from "Vector";

export class ScopePopupController {
    private scopePopup: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    public constructor() {
        this.scopePopup = <HTMLCanvasElement>document.getElementById("#scope-view");
        this.context = this.scopePopup.getContext("2d");
        this.scopePopup.style.left = "200px";
        this.scopePopup.style.right = "200px";
        this.show();
        this.plotData(null);
    }

    public show(): void {
        this.scopePopup.classList.remove("invisible");
    }
    
    public hide(): void {
        this.scopePopup.classList.add("invisible");
    }



    public plotData(vecArray: Vector[] | null): void {
        this.context.moveTo(0,0)
        this.context.lineTo(200,100);
        this.context.stroke();
    }

    private setUpGraph() {
    }
}