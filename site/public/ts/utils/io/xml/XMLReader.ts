import {XMLNode} from "./XMLNode";
import {XMLable} from "./XMLable";

export class XMLReader {
    private root: XMLDocument;
    private rootNode: XMLNode;

    public constructor(root: XMLDocument) {
        this.root = root;
        this.rootNode = new XMLNode(this.root, this.root.childNodes[0]);
    }

    public getRoot(): XMLNode {
        return this.rootNode;
    }

    public loadObject(obj: XMLable) {
        obj.load(this.rootNode)
    }

    public static fromString(contents: string): XMLReader {
        const root = <XMLDocument>new DOMParser().parseFromString(contents, "text/xml");
        if (root.documentElement.nodeName == "parsererror")
            return null;
        return new XMLReader(root);
    }

    public static fromStringDirect(obj: XMLable, contents: string) {
        const root = <XMLDocument>new DOMParser().parseFromString(contents, "text/xml");
        if (root.documentElement.nodeName == "parsererror")
            return;
        this.fromXMLDocumentDirect(obj, root);
    }

    public static fromXMLDocumentDirect(obj: XMLable, contents: XMLDocument) {
        const reader = new XMLReader(contents);
        obj.load(reader.getRoot());
    }

    // TODO: remove these functions below
    public getVersion(): number {
        const root = this.getRoot();
        if (root.hasAttribute("version"))
            return root.getIntAttribute("version");
        return -1;
    }

    public getName(): string {
        const root = this.getRoot();
        if (root.hasAttribute("name"))
            return root.getAttribute("name");
        return undefined;
    }

}
