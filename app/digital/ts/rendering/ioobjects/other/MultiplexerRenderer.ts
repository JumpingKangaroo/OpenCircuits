import {DEFAULT_BORDER_WIDTH,
        DEFAULT_BORDER_COLOR,
        DEFAULT_FILL_COLOR,
        SELECTED_BORDER_COLOR,
        SELECTED_FILL_COLOR} from "core/utils/Constants";
import {V} from "Vector";

import {Renderer} from "../../../../../core/ts/rendering/Renderer";
import {Camera} from "math/Camera";
import {Multiplexer}   from "digital/models/ioobjects/other/Multiplexer";
import {Demultiplexer} from "digital/models/ioobjects/other/Demultiplexer";

import {Polygon} from "../../../../../core/ts/rendering/shapes/Polygon";
import {Style} from "../../../../../core/ts/rendering/Style";

export const MultiplexerRenderer = (() => {

    return {
        render(renderer: Renderer, _: Camera, mul: Multiplexer | Demultiplexer, selected: boolean): void {
            const transform = mul.getTransform();
            const borderCol = (selected ? SELECTED_BORDER_COLOR : DEFAULT_BORDER_COLOR);
            const fillCol   = (selected ? SELECTED_FILL_COLOR   : DEFAULT_FILL_COLOR);
            const style = new Style(fillCol, borderCol, DEFAULT_BORDER_WIDTH);

            //
            // Creates the Multiplexer and Demultiplexer the correct size
            //
            if (mul instanceof Multiplexer){
                const p1 = V(-transform.getSize().x/2 , transform.getSize().y/2 + 7);
                const p2 = V(-transform.getSize().x/2 , -transform.getSize().y/2 - 7);
                const p3 = V(transform.getSize().x/2 , -transform.getSize().y/2 + 18);
                const p4 = V(transform.getSize().x/2 , transform.getSize().y/2 - 18);

                renderer.draw(new Polygon([p1, p2, p3, p4]), style);
            }
            else {
                const p1 = V(transform.getSize().x/2 , transform.getSize().y/2 + 7);
                const p2 = V(transform.getSize().x/2 , -transform.getSize().y/2 - 7);
                const p3 = V(-transform.getSize().x/2, -transform.getSize().y/2 + 18);
                const p4 = V(-transform.getSize().x/2, transform.getSize().y/2 - 18);

                renderer.draw(new Polygon([p1, p2, p3, p4]), style);
            }
        }
    }
})();
