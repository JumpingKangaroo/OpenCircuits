

import {Images} from "./utils/Images";
// import {ICDesignerController} from "./controllers/ICDesignerController";
import {MainDesignerController} from "./controllers/MainDesignerController";
import {HeaderController} from "./controllers/HeaderController";
import {ItemNavController} from "./controllers/ItemNavController";
// import {InputController} from "./utils/input/InputController";
import {ContextMenuController} from "./controllers/ContextMenuController";

function Start() {
    Load(Init);
}

function Load(onFinishLoading: () => void) {
    Images.Load(onFinishLoading);
}

function Init() {
    // Initialize all controllers
    MainDesignerController.Init();
    HeaderController.Init(MainDesignerController.GetDesigner());
    ItemNavController.Init(MainDesignerController.GetDesigner());
    ContextMenuController.Init();
    // ICDesignerController.Init();

    MainDesignerController.Render();
    // InputController.Init();
}

Start();
