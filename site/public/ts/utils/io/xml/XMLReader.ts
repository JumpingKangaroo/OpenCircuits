import {XMLNode} from "./XMLNode";
import {XMLable} from "./XMLable";

export class XMLReader {
    private root: XMLDocument;
    private rootNode: XMLNode;

    private metadataNode: XMLNode;
    private contentsNode: XMLNode;

    public constructor(root: XMLDocument) {
        this.root = root;
        this.rootNode = new XMLNode(this.root, this.root.childNodes[0]);

        this.metadataNode = this.rootNode.findChild("metadata");
        this.contentsNode = this.rootNode.findChild("contents");

        // Old file version didn't have Metadata
        if (!this.metadataNode) {
            this.metadataNode = this.rootNode;
            this.contentsNode = this.rootNode;
        }
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
        const root = this.metadataNode;
        if (root.hasAttribute("version"))
            return root.getIntAttribute("version");
        return -1;
    }

    public getName(): string {
        const root = this.metadataNode;
        if (root.hasAttribute("name"))
            return root.getAttribute("name");
        return undefined;
    }

    public getContentsNode(): XMLNode {
        return this.contentsNode;
    }

}
