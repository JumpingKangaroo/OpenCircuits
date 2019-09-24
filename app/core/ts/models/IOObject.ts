import {XMLNode} from "core/utils/io/xml/XMLNode";
import {XMLable} from "core/utils/io/xml/XMLable";

import {Selectable} from "core/utils/Selectable";
import {Name} from "core/utils/Name";

import {DigitalCircuitDesigner} from "../DigitalCircuitDesigner";

export abstract class IOObject implements Selectable, XMLable {
    protected designer?: DigitalCircuitDesigner;
    protected name: Name;

    protected constructor() {
        this.name = new Name(this.getDisplayName());
    }

    public abstract activate(signal: boolean, i?: number): void;

    public setDesigner(designer?: DigitalCircuitDesigner): void {
        this.designer = designer;
    }

    public getDesigner(): DigitalCircuitDesigner {
        return this.designer;
    }

    public setName(name: string): void {
        this.name.setName(name);
    }
    public getName(): string {
        return this.name.getName();
    }

    public copy(): IOObject {
        const copy = new (<new () => IOObject>this.constructor)();
        copy.name = new Name(this.name.getName());
        return copy;
    }

    public save(node: XMLNode): void {
        node.addAttribute("name", this.name.getName());
    }
    public load(node: XMLNode): void {
        this.name = new Name(node.getAttribute("name"));
    }

    public abstract getDisplayName(): string;
    public abstract getXMLName(): string;

}