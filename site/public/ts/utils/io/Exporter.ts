import {Utils} from "./Utils";
import jsPDF from "jspdf";

import {XMLWriter} from "./xml/XMLWriter";
import {Circuit} from "../../models/Circuit";

declare var jsPDF: any; // jsPDF is external library

export const Exporter = (() => {
    return {
        WriteCircuit: function(designer: CircuitDesigner, name: string): string {
            const writer = new XMLWriter(designer.getXMLName());

            writer.setVersion(1.1);
            writer.setName(name);
            writer.setThumbnail("data:,"); // TODO: Generate a thumbnail

            designer.save(writer.getContentsNode());

            return writer.serialize();
        },
        SaveFile: function(designer: CircuitDesigner, projectName: string): void {
            // Get name
            if (projectName.replace(/\s+/g, "") === "")
                projectName = "Untitled Circuit";

            const data = this.WriteCircuit(designer, projectName);

            const filename = projectName + ".circuit";

            const file = new Blob([data], {type: "text/xml"});
            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                window.navigator.msSaveOrOpenBlob(file, fileName);
            } else { // Others
                const a = document.createElement("a");
                const url = URL.createObjectURL(file);
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        SavePNG: function(canvas: HTMLCanvasElement, projectName: string): void {
            const data = canvas.toDataURL("image/png", 1.0);

            // Get name
            if (projectName.replace(/\s+/g, "") === "")
                projectName = "Untitled Circuit";
            const filename = projectName + ".png";

            if (window.navigator.msSaveOrOpenBlob) { // IE10+
                const file = new Blob([data], {type: "image/png"});
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else { // Others
                const a = document.createElement("a");
                const url = data;
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        },
        SavePDF: function(canvas: HTMLCanvasElement, projectName: string): void {
            const width  = canvas.width;
            const height = canvas.height;

            const data = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("l", "px", [width, height]);

            // Get name
            if (projectName.replace(/\s+/g, "") === "")
                projectName = "Untitled Circuit";

            // Fill background
            pdf.setFillColor("#CCC");
            pdf.rect(0, 0, width, height, "F");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(filename);
        }
    }

})();
