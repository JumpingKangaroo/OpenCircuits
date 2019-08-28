import {DEFAULT_BORDER_WIDTH,
        IO_PORT_RADIUS,
        IO_PORT_BORDER_WIDTH,
        WIRE_SNAP_THRESHOLD} from "../../utils/Constants";

import {Vector,V}     from "../../utils/math/Vector";
import {Transform}    from "../../utils/math/Transform";
import {RectContains} from "../../utils/math/MathUtils";
import {XMLNode}      from "../../utils/io/xml/XMLNode";
import {ClampedValue} from "../../utils/ClampedValue";

import {Port}       from "../ports/Port";
import {InputPort}  from "../ports/InputPort";
import {OutputPort} from "../ports/OutputPort";
import {InputPortSet,
        OutputPortSet} from "../ports/PortSets";
import {Positioner} from "../ports/positioners/Positioner";

import {CullableObject}   from "./CullableObject";
import {Wire}       from "./Wire";

function Snap(wire: Wire, x: number, c: number): number {
    if (Math.abs(x - c) <= WIRE_SNAP_THRESHOLD) {
        wire.setIsStraight(true);
        return c;
    }
    return x;
}

export abstract class Component extends CullableObject {
    protected inputs:  InputPortSet;
    protected outputs: OutputPortSet;

    protected transform: Transform;

    protected constructor(inputPortCount: ClampedValue, outputPortCount: ClampedValue, size: Vector,
                          inputPositioner?: Positioner<InputPort>, outputPositioner?: Positioner<OutputPort>) {
        super();

        this.transform = new Transform(V(), size);

        this.inputs  = new InputPortSet (this, inputPortCount, inputPositioner);
        this.outputs = new OutputPortSet(this, outputPortCount, outputPositioner);
    }

    public onTransformChange(): void {
        super.onTransformChange();
        this.getInputs().concat(this.getOutputs()).
                forEach((w) => w.onTransformChange());
    }

    /**
     * Activates this component with the given signal
     *  through the output port at index i
     * @param signal The signal (on or off)
     * @param i      The index of the output port
     *               Must be 0 <= i < outputs.length
     */
    public activate(signal: boolean, i: number = 0): void {
        // Don't try to activate an Output component since it has no outputs
        if (this.outputs.isEmpty())
            return;

        this.outputs.get(i).activate(signal);
    }


    public setInputPortCount(val: number): void {
        this.inputs.setPortCount(val);
        this.onTransformChange();
    }

    public setOutputPortCount(val: number): void {
        this.outputs.setPortCount(val);
        this.onTransformChange();
    }

    public setPos(v: Vector): void {
        // Snap to connections
        for (const port of this.getPorts()) {
            const pos = port.getWorldTargetPos().sub(this.getPos());
            const wires = port.getWires();
            for (const w of wires) {
                // Get the port that isn't the current port
                const port2 = (w.getInput() == port ? w.getOutput() : w.getInput());
                w.setIsStraight(false);
                v.x = Snap(w, v.x + pos.x, port2.getWorldTargetPos().x) - pos.x;
                v.y = Snap(w, v.y + pos.y, port2.getWorldTargetPos().y) - pos.y;
            }
        }

        this.transform.setPos(v);
        this.onTransformChange();
    }

    public setAngle(a: number): void {
        this.transform.setAngle(a);
        this.onTransformChange();
    }

    public setRotationAbout(a: number, c: Vector): void {
        this.transform.setRotationAbout(a, c);
        this.onTransformChange();
    }


    /**
     * Determines whether or not a point is within
     *  this component's "pressable" bounds (always false)
     *  for most components
     * @param  v The point
     * @return   True if the point is within this component,
     *           false otherwise
     */
    public isWithinPressBounds(_: Vector): boolean {
        return false;
    }

    /**
     * Determines whether or not a point is within
     *  this component's "selectable" bounds
     * @param  v The point
     * @return   True if the point is within this component,
     *           false otherwise
     */
    public isWithinSelectBounds(v: Vector): boolean {
        return RectContains(this.getTransform(), v) &&
                !this.isWithinPressBounds(v);
    }


    public getInputPort(i: number): InputPort {
        return this.inputs.get(i);
    }

    public getInputPortPos(i: number): Vector {
        return this.getInputPort(i).getWorldTargetPos();
    }

    public getInputPorts(): InputPort[] {
        return this.inputs.getPorts();
    }

    public getInputPortCount(): ClampedValue {
        return this.inputs.getCount();
    }

    public getInputs(): Wire[] {
        // Get each wire connected to each InputPort
        //  and then filter out the null ones
        return this.getInputPorts().map((p) => p.getInput())
                .filter((w) => w != null);
    }

    public numInputs(): number {
        return this.inputs.length;
    }

    public getOutputPort(i: number): OutputPort {
        return this.outputs.get(i);
    }

    public getOutputPortPos(i: number): Vector {
        return this.getOutputPort(i).getWorldTargetPos();
    }

    public getOutputPorts(): OutputPort[] {
        return this.outputs.getPorts();
    }

    public getOutputPortCount(): ClampedValue {
        return this.outputs.getCount();
    }

    public getOutputs(): Wire[] {
        // Accumulate all the OutputPort connections
        return this.getOutputPorts().reduce(
            (acc, p) => acc.concat(p.getConnections()), []
        );
    }

    public numOutputs(): number {
        return this.outputs.length;
    }

    public getPorts(): Port[] {
        return (<Port[]>this.getInputPorts()).concat(this.getOutputPorts());
    }


    public getPos(): Vector {
        return this.transform.getPos();
    }

    public getSize(): Vector {
        return this.transform.getSize();
    }

    public getAngle(): number {
        return this.transform.getAngle();
    }

    public getTransform(): Transform {
        return this.transform.copy();
    }


    public getMinPos(): Vector {
        const min = V(Infinity);

        // Find minimum pos from corners of transform
        const corners = this.transform.getCorners().map(
            v => v.sub(DEFAULT_BORDER_WIDTH)
        );

        // Find minimum pos from ports
        const ports = this.getPorts().map(
            p => p.getWorldTargetPos().sub(IO_PORT_RADIUS+IO_PORT_BORDER_WIDTH)
        );

        return Vector.min(min, ...corners, ...ports);
    }

    public getMaxPos(): Vector {
        const max = V(-Infinity);

        // Find maximum pos from corners of transform
        const corners = this.transform.getCorners().map(
            v => v.add(DEFAULT_BORDER_WIDTH)
        );

        // Find maximum pos from ports
        const ports = this.getPorts().map(
            p => p.getWorldTargetPos().add(IO_PORT_RADIUS+IO_PORT_BORDER_WIDTH)
        );

        return Vector.max(max, ...corners, ...ports);
    }


    public copy(): Component {
        const copy = <Component>super.copy();

        // Copy properties
        copy.transform = this.transform.copy();

        copy.inputs = this.inputs.copy(copy);
        copy.outputs = this.outputs.copy(copy);

        return copy;
    }

    public save(node: XMLNode): void {
        super.save(node);
        node.addVectorAttribute("", this.getPos());
        node.addAttribute("angle", this.getAngle());
    }

    public load(node: XMLNode): void {
        super.load(node);
        this.setPos(node.getVectorAttribute(""));
        this.setAngle(node.getFloatAttribute("angle"));
    }


    public getImageName(): string {
        return undefined;
    }
}
