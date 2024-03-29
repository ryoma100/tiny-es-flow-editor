import * as i18n from "@solid-primitives/i18n";
import { JSX, createContext, createMemo, createSignal, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { DragType } from "../components/diagram/diagram";
import { ToolbarType } from "../components/toolbar/toolbar";
import { defaultLine, defaultRectangle } from "../constants/app-const";
import { enDict } from "../constants/i18n-en";
import { jaDict } from "../constants/i18n-ja";
import { makeActivityModel } from "../data-model/activity-node-model";
import { makeActorModel } from "../data-model/actor-model";
import { makeEdgeModel } from "../data-model/edge-model";
import { makeExtendEdgeModel } from "../data-model/extend-edge-model";
import { makeExtendNodeModel } from "../data-model/extend-node-model";
import { makeNodeModel } from "../data-model/node-model";
import { makeProcessModel } from "../data-model/process-model";
import { makeProjectModel } from "../data-model/project-model";
import { makeTransactionEdgeModel } from "../data-model/transaction-edge-model";
import {
  ActivityNode,
  ActorEntity,
  CommentNode,
  Line,
  ProcessEntity,
  ProjectEntity,
  Rectangle,
  TransitionEdge,
} from "../data-source/data-type";

function makeI18nContext() {
  const dictionaries = { ja: jaDict, en: enDict };
  const [locale, setLocale] = createSignal<keyof typeof dictionaries>("ja");
  const dict = createMemo(() => i18n.flatten(dictionaries[locale()]));
  return { dict, setLocale };
}

function makeModelContext() {
  const actorModel = makeActorModel();
  const nodeModel = makeNodeModel();
  const edgeModel = makeEdgeModel(nodeModel);
  const processModel = makeProcessModel(actorModel, nodeModel, edgeModel);
  const projectModel = makeProjectModel(processModel);

  const activityNodeModel = makeActivityModel(nodeModel);
  const transitionEdgeModel = makeTransactionEdgeModel(edgeModel, nodeModel);
  const extendNodeModel = makeExtendNodeModel(nodeModel);
  const extendEdgeModel = makeExtendEdgeModel(edgeModel, nodeModel);

  return {
    actorModel,
    nodeModel,
    edgeModel,
    processModel,
    projectModel,
    activityNodeModel,
    transitionEdgeModel,
    extendNodeModel,
    extendEdgeModel,
  };
}

function makeDiagramContext() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1.0);
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<Line>(defaultLine);
  const [svgRect, setSvgRect] = createStore({ ...defaultRectangle });
  const [viewBox, setViewBox] = createStore({ ...defaultRectangle });

  function setAddingLineFrom(x: number, y: number) {
    setAddingLine({ p1: { x, y }, p2: { x, y } });
  }

  function setAddingLineTo(x: number, y: number) {
    setAddingLine({ p1: addingLine().p1, p2: { x, y } });
  }

  function autoRectangle(rect: Rectangle) {
    setZoom(Math.min(svgRect.width / rect.width, svgRect.height / rect.height));
    setViewBox({ x: rect.x, y: rect.y, width: viewBox.width, height: viewBox.height });
  }

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLineFrom,
    setAddingLineTo,
    svgRect,
    setSvgRect,
    autoRectangle,
    viewBox,
    setViewBox,
  };
}

export type DialogType =
  | { type: "load" }
  | { type: "save"; project: ProjectEntity }
  | { type: "about" }
  | { type: "project"; project: ProjectEntity }
  | { type: "process"; process: ProcessEntity }
  | { type: "actor"; actor: ActorEntity }
  | { type: "activity"; activity: ActivityNode }
  | { type: "transition"; transition: TransitionEdge }
  | { type: "comment"; comment: CommentNode }
  | { type: "initAll" }
  | { type: "deleteProcess"; process: ProcessEntity };

function makeDialogContext() {
  const [openDialog, setOpenDialog] = createSignal<DialogType | null>(null);
  const [openMessageDialog, setOpenMessageDialog] = createSignal<keyof typeof enDict | null>(null);

  return {
    openDialog,
    setOpenDialog,
    openMessageDialog,
    setOpenMessageDialog,
  };
}

const appContextValue = {
  i18n: makeI18nContext(),
  ...makeModelContext(),
  diagram: makeDiagramContext(),
  dialog: makeDialogContext(),
};

const AppContext = createContext<{
  i18n: ReturnType<typeof makeI18nContext>;
  actorModel: ReturnType<typeof makeActorModel>;
  nodeModel: ReturnType<typeof makeNodeModel>;
  edgeModel: ReturnType<typeof makeEdgeModel>;
  processModel: ReturnType<typeof makeProcessModel>;
  projectModel: ReturnType<typeof makeProjectModel>;
  activityNodeModel: ReturnType<typeof makeActivityModel>;
  transitionEdgeModel: ReturnType<typeof makeTransactionEdgeModel>;
  extendNodeModel: ReturnType<typeof makeExtendNodeModel>;
  extendEdgeModel: ReturnType<typeof makeExtendEdgeModel>;
  diagram: ReturnType<typeof makeDiagramContext>;
  dialog: ReturnType<typeof makeDialogContext>;
}>(appContextValue);

export function AppProvider(props: { children: JSX.Element }) {
  return <AppContext.Provider value={appContextValue}>{props.children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
