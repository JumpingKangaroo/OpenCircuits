class CircuitDesigner {
    constructor(canvas, vw, vh) {
        this.renderer = new Renderer(this, canvas, vw, vh);
        this.camera = new Camera(this);
        this.input = new Input(this);
        this.history = new HistoryManager();

        this.wires = [];
        this.objects = [];

        this.propogationQueue = [];
    }
    reset() {
        for (var i = 0; i < this.objects.length; i++)
            this.objects[i].remove();
        for (var i = 0; i < this.wires.length; i++)
            this.wires[i].remove();
        this.objects = [];
        this.wires = [];
        this.propogationQueue = [];
    }
    propogate(sender, receiver, signal) {
        this.propogationQueue.push(new Propogation(sender, receiver, signal, () => this.update(sender, receiver)));//() => this.update()));
    }
    update(sender, receiver) {
        var tempQueue = [];
        while (this.propogationQueue.length > 0)
            tempQueue.push(this.propogationQueue.pop());

        while (tempQueue.length > 0)
            tempQueue.pop().send();

        if (this.propogationQueue.length > 0)
            updateRequests++;

        updateRequests--;

        // See if the sender/receiver is a wire in the scene (not in an IC) to render
        var inScene = false;
        if (sender instanceof Wire || receiver instanceof Wire) {
            for (var i = 0; i < this.wires.length; i++) {
                if (this.wires[i] === sender || this.wires[i] === receiver) {
                    inScene = true;
                    break;
                }
            }
        } else {
            render();
        }

        if (inScene)
            render();

        if (updateRequests > 0) {
            setTimeout(() => this.update(sender, receiver), PROPOGATION_TIME);
        }
    }
    render() {
        // console.log("RENDER");

        this.renderer.clear();

        var step = GRID_SIZE/this.camera.zoom;

        var cpos = V(this.camera.pos.x/this.camera.zoom - this.renderer.canvas.width/2, this.camera.pos.y/this.camera.zoom - this.renderer.canvas.height/2);

        var cpx = cpos.x - Math.floor(cpos.x / step) * step;
        if (cpx < 0) cpx += step;
        var cpy = cpos.y - Math.floor(cpos.y / step) * step;
        if (cpy < 0) cpy += step;

        // Batch-render the lines = uglier code + way better performance
        this.renderer.save();
        this.renderer.setStyles(undefined, '#999', 1 / this.camera.zoom);
        this.renderer.context.beginPath();
        for (var x = -cpx; x <= this.renderer.canvas.width-cpx+step; x += step) {
            this.renderer._line(x, 0, x, this.renderer.canvas.height);
        }
        for (var y = -cpy; y <= this.renderer.canvas.height-cpy+step; y += step) {
            this.renderer._line(0, y, this.renderer.canvas.width, y);
        }
        this.renderer.context.closePath();
        this.renderer.context.stroke();
        this.renderer.restore();

        // Cull objects/wires if they aren't on the screen
        var p1 = this.camera.getWorldPos(V(0, 0));
        var p2 = this.camera.getWorldPos(V(this.renderer.canvas.width, this.renderer.canvas.height));
        var screen = new Transform(p2.add(p1).scale(0.5), p2.sub(p1), 0, this.camera);
        var radius = Math.sqrt(screen.size.x*screen.size.x + screen.size.y*screen.size.y)/2;

        for (var i = 0; i < this.wires.length; i++) {
            var wire = this.wires[i];
            var trans = wire.getCullBox();

            // this.renderer.save();
            // trans.transformCtx(this.renderer.context);
            // this.renderer.rect(0, 0, trans.size.x, trans.size.y, '#ff00ff');
            // this.renderer.restore();

            if (transformContains(trans, screen)) {
                wire.draw();
            }
        }
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            var trans = obj.getCullBox();

            // this.renderer.save();
            // t.transformCtx(this.renderer.context);
            // this.renderer.rect(0, 0, t.size.x, t.size.y, '#ff00ff');
            // this.renderer.restore();

            if (transformContains(trans, screen)) {
                obj.draw();
            }
        }

        currentTool.draw(this.renderer);
    }
    addObject(o) {
        if (this.getIndexOfObject(o) === -1)
            this.objects.push(o);
        else
            console.log(new Error());
    }
    addWire(w) {
        if (this.getIndexOfWire(w) === -1)
            this.wires.push(w);
        else
            console.log(new Error());
    }
    getRenderer() {
        return this.renderer;
    }
    getObjects() {
        return this.objects;
    }
    getWires() {
        return this.wires;
    }
    getIndexOfObject(obj) {
        for (var i = 0; i < this.objects.length; i++) {
            if (obj === this.objects[i])
                return i;
        }
        return -1;
    }
    getIndexOfWire(wire) {
        for (var i = 0; i < this.wires.length; i++) {
            if (wire === this.wires[i])
                return i;
        }
        return -1;
    }
}
