import { JSXElement, Match, Switch, onMount } from "solid-js";
import { ACTIVITY_MIN_HEIGHT } from "../../constants/app-const";
import { useAppContext } from "../../context/app-context";
import { ActivityNode, ActivityNodeType, JoinType, SplitType } from "../../data-source/data-type";
import {
  AutoActivityIcon,
  AutoTimerActivityIcon,
  ManualActivityIcon,
  ManualTimerActivityIcon,
  UserActivityIcon,
} from "../icons/material-icons";
import "./activity-node.css";

export function ActivityNodeContainer(props: { activity: ActivityNode }): JSXElement {
  const {
    activityModel: { layerTopActivity, resizeActivityHeight },
    actorModel: { actorList },
    transitionModel: { addTransition },
    otherEdgeModel: { addCommentEdge, addStartEdge },
    baseNodeModel: { changeSelectNodes },
    baseEdgeModel: { changeSelectEdges },
    dialog: { setOpenActivityDialog },
    diagram: { toolbar, dragType, setDragType, setAddingLineFrom },
  } = useAppContext();

  function handleLeftMouseDown(_e: MouseEvent) {
    changeSelectNodes("select", [props.activity.id]);
    setDragType("resizeActivityLeft");
  }

  function handleRightMouseDown(_e: MouseEvent) {
    changeSelectNodes("select", [props.activity.id]);
    setDragType("resizeActivityRight");
  }

  function handleMouseDown(e: MouseEvent) {
    switch (toolbar()) {
      case "cursor":
        if (e.shiftKey) {
          changeSelectNodes("toggle", [props.activity.id]);
          setDragType("none");
          e.stopPropagation();
        } else {
          if (!props.activity.selected) {
            changeSelectNodes("select", [props.activity.id]);
            changeSelectEdges("clearAll");
          }
          layerTopActivity(props.activity.id);
          setDragType("moveNodes");
        }
        break;
      case "transition":
        changeSelectNodes("select", [props.activity.id]);
        setAddingLineFrom(
          props.activity.x + props.activity.width,
          props.activity.y + props.activity.height / 2,
        );
        setDragType("addTransition");
        break;
    }
  }

  function handleMouseUp(_e: MouseEvent) {
    switch (dragType()) {
      case "addTransition":
        addTransition(props.activity.id);
        setDragType("none");
        break;
      case "addCommentEdge":
        addCommentEdge(props.activity.id);
        setDragType("none");
        break;
      case "addStartEdge":
        addStartEdge(props.activity.id);
        setDragType("none");
        break;
    }
  }

  function handleDblClick() {
    setOpenActivityDialog(props.activity);
  }

  return (
    <foreignObject
      data-id={props.activity.xpdlId}
      x={props.activity.x}
      y={props.activity.y}
      width={props.activity.width}
      height={props.activity.height}
      onMouseUp={handleMouseUp}
    >
      <ActivityNodeView
        type={props.activity.type}
        name={props.activity.name}
        actorName={actorList.find((it) => it.id === props.activity.actorId)?.name ?? ""}
        joinType={props.activity.joinType}
        splitType={props.activity.splitType}
        selected={props.activity.selected}
        width={props.activity.width}
        onLeftMouseDown={handleLeftMouseDown}
        onMouseDown={handleMouseDown}
        onRightMouseDown={handleRightMouseDown}
        onDblClick={handleDblClick}
        onChangeHeight={(height) => resizeActivityHeight(props.activity, height)}
      />
    </foreignObject>
  );
}

export function ActivityNodeView(props: {
  type: ActivityNodeType;
  name: string;
  actorName: string;
  joinType: JoinType;
  splitType: SplitType;
  selected: boolean;
  width: number;
  onLeftMouseDown?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onRightMouseDown?: (e: MouseEvent) => void;
  onDblClick?: (e: MouseEvent) => void;
  onChangeHeight?: (height: number) => void;
}): JSXElement {
  onMount(() => {
    const observer = new ResizeObserver(() => {
      if (titleDiv) {
        const height = titleDiv.clientHeight + ACTIVITY_MIN_HEIGHT;
        props.onChangeHeight?.(height);
      }
    });
    if (titleDiv) {
      observer.observe(titleDiv);
    }
  });

  let titleDiv: HTMLDivElement | undefined;
  return (
    <div
      style={{ width: `${props.width}px` }}
      class="activity"
      classList={{ "activity--selected": props.selected }}
    >
      <div class="activity__resize" onMouseDown={(e) => props.onLeftMouseDown?.(e)}>
        <Switch>
          <Match when={props.joinType === "oneJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.joinType === "xorJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50 M 1 0 L 1 100" />
            </svg>
          </Match>
          <Match when={props.joinType === "andJoin"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 0 L 10 50 L 0 100 M 5 25 L 5 75" />
            </svg>
          </Match>
        </Switch>
      </div>

      <div
        class="activity__main"
        onMouseDown={(e) => props.onMouseDown?.(e)}
        onDblClick={(e) => props.onDblClick?.(e)}
      >
        <div class="activity__actor">{props.actorName}</div>
        <div class="activity__icon">
          <Switch>
            <Match when={props.type === "manualActivity"}>
              <ManualActivityIcon />
            </Match>
            <Match when={props.type === "autoActivity"}>
              <AutoActivityIcon />
            </Match>
            <Match when={props.type === "manualTimerActivity"}>
              <ManualTimerActivityIcon />
            </Match>
            <Match when={props.type === "autoTimerActivity"}>
              <AutoTimerActivityIcon />
            </Match>
            <Match when={props.type === "userActivity"}>
              <UserActivityIcon />
            </Match>
          </Switch>
        </div>
        <div ref={titleDiv} class="activity__title">
          {props.name}
        </div>
      </div>

      <div class="activity__resize" onMouseDown={(e) => props.onRightMouseDown?.(e)}>
        <Switch>
          <Match when={props.splitType === "oneSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 10 50" />
            </svg>
          </Match>
          <Match when={props.splitType === "xorSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 0 50 L 9 50 M 9 0 L 9 100" />
            </svg>
          </Match>
          <Match when={props.splitType === "andSplit"}>
            <svg viewBox="0 0 10 100" preserveAspectRatio="none" width="100%" height="100%">
              <path class="activity__svg-line" d="M 10 0 L 0 50 L 10 100 M 5 25 L 5 75" />
            </svg>
          </Match>
        </Switch>
      </div>
    </div>
  );
}
