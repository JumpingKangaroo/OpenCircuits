import {V} from "Vector";
import {ClampedValue} from "math/ClampedValue";

import {AnalogComponent} from "../AnalogComponent";
import {ScopePopupController} from "../../../../../site/public/ts/shared/controllers/ScopePopupController";

export class Scope extends AnalogComponent {
    private scopePopup: ScopePopupController;
    public constructor() {
        super(new ClampedValue(2), V(50, 50));    
    }

    public getDisplayName(): string {
        return "Scope";
    }

    public getImageName(): string {
        return "voltagesource.svg";
    }

    public getXMLName(): string {
        return "scope";
    }
}