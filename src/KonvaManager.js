import Konva from "konva";
import EventManager from "./EventManager.js";
import ShapeManager from "./ShapeManager.js";

export class KonvaManager {
    /**
     * 
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        /**
         * @type {Konva.Stage}
         */
        this.stage = new Konva.Stage({
            container: container,
            width: 1500,
            height: 800,
        });

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        // EventManager instance to handle
        // generic events like zoom in/out/
        // enable/disable drag etc
        this.eventManager = new EventManager(this.stage, this);

        // ShapeManager instance to handle
        // creating shapes and tbd ...
        this.shapeManager = new ShapeManager(this.stage, this.layer);

        // this.initShapes();
        this.setupBackground();
        this.layer.draw();
    }

    /** @deprecated - for initial implementation only */
    initShapes() {
        const circle = new Konva.Circle({
            x: this.stage.width() / 2,
            y: this.stage.height() / 2,
            radius: 70,
            fill: "red",
            stroke: "black",
            strokeWidth: 4,
        });

        this.layer.add(circle);
    }

    setupBackground() {
        this.stage.container().style.backgroundImage =
            "url('/dist/image/background-grid.jpg')";
        this.stage.container().style.backgroundRepeat = "repeat";
    }
}
