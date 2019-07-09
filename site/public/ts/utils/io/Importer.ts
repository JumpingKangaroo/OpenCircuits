import {XMLReader} from "./xml/XMLReader";
import {XMLable} from "./xml/XMLable";

export const Importer = (() => {
    return {
        LoadFromFile: function (obj: XMLable, file: File): void {
            // TOOD: only ask for confirmation if nothing was done to the scene
            //        ex. no objects, or wires, or history of actions
            const open = confirm("Are you sure you want to overwrite your current scene?");

            if (open) {
                const reader = new FileReader();
                reader.onload = () => {
                    XMLReader.fromString(obj, reader.result.toString());
                };

                reader.readAsText(file);
            }
        }
    }

})();
