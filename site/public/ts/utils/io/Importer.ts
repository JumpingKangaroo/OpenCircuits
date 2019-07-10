import {XMLReader} from "./xml/XMLReader";
import {Circuit} from "../../models/Circuit";
import {ResolveVersionConflict} from "./VersionConflictResolver";

export const Importer = (() => {
    return {
        LoadCircuitFromFile: function (circuit: Circuit, file: File): void {
            // TOOD: only ask for confirmation if nothing was done to the scene
            //        ex. no objects, or wires, or history of actions
            const open = confirm("Are you sure you want to overwrite your current scene?");

            if (open) {
                const reader = new FileReader();
                reader.onload = () => {
                    const docReader = XMLReader.fromString(reader.result.toString());
                    ResolveVersionConflict(docReader);
                    docReader.loadObject(circuit);
                };

                reader.readAsText(file);
            }
        }
    }

})();
