import { JSX, createContext, createSignal, useContext } from "solid-js";
import { createPackageModel } from "../models/package-model";
import { createActorModel } from "../models/actor-model";
import { createActivityModel } from "../models/activity-model";
import { createTransitionModel } from "../models/transition-model";
import { createProcessModel } from "../models/process-model";
import { ToolbarType } from "../components/toolbar/toolbar";
import { DragType } from "../diagram/disgram";

const AppContext = createContext<{
  packageModel: ReturnType<typeof createPackageModel>;
  processModel: ReturnType<typeof createProcessModel>;
  actorModel: ReturnType<typeof createActorModel>;
  activityModel: ReturnType<typeof createActivityModel>;
  transitionModel: ReturnType<typeof createTransitionModel>;
  dialog: ReturnType<typeof createDialogContext>;
  diagram: ReturnType<typeof createDiagramContext>;
}>({
  packageModel: undefined as any,
  processModel: undefined as any,
  actorModel: undefined as any,
  activityModel: undefined as any,
  transitionModel: undefined as any,
  dialog: undefined as any,
  diagram: undefined as any,
});

function createModelContext() {
  const packageModel = createPackageModel();
  const actorModel = createActorModel();
  const activityModel = createActivityModel(actorModel);
  const transitionModel = createTransitionModel(activityModel);
  const processModel = createProcessModel(
    actorModel,
    activityModel,
    transitionModel
  );

  return {
    packageModel,
    processModel,
    actorModel,
    activityModel,
    transitionModel,
  };
}

function createDialogContext() {
  const [openPackageDialog, setOpenPackageDialog] = createSignal(false);
  const [openProcessDialogId, setOpenProcessDialogId] = createSignal(0);
  const [openActorDialogId, setOpenActorDialogId] = createSignal(0);
  const [openActivityDialogId, setOpenActivityDialogId] = createSignal(0);
  const [openTransitionDialogId, setOpenTransitionDialogId] = createSignal(0);

  return {
    openPackageDialog,
    setOpenPackageDialog,
    openProcessDialogId,
    setOpenProcessDialogId,
    openActorDialogId,
    setOpenActorDialogId,
    openActivityDialogId,
    setOpenActivityDialogId,
    openTransitionDialogId,
    setOpenTransitionDialogId,
  };
}

function createDiagramContext() {
  const [toolbar, setToolbar] = createSignal<ToolbarType>("cursor");
  const [zoom, setZoom] = createSignal<number>(1);
  const [dragType, setDragType] = createSignal<DragType>("none");
  const [addingLine, setAddingLine] = createSignal<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>({ fromX: 0, fromY: 0, toX: 0, toY: 0 });

  return {
    toolbar,
    setToolbar,
    zoom,
    setZoom,
    dragType,
    setDragType,
    addingLine,
    setAddingLine,
  };
}

export function AppProvider(props: { children: JSX.Element }) {
  const value = {
    ...createModelContext(),
    dialog: createDialogContext(),
    diagram: createDiagramContext(),
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}