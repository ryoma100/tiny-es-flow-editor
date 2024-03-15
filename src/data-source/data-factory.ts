import { ACTIVITY_MIN_WIDTH, NORMAL_ICON_SIZE } from "../constants/app-const";
import {
  ActivityNode,
  ActivityNodeType,
  ActorEntity,
  ApplicationEntity,
  CommentEdge,
  CommentNode,
  EndEdge,
  EndNode,
  EnvironmentEntity,
  IEdge,
  INode,
  ProcessEntity,
  ProjectEntity,
  StartEdge,
  StartNode,
  TransitionEdge,
} from "./data-type";

function createProject(created: string = new Date().toISOString()): ProjectEntity {
  const project: ProjectEntity = {
    created,
    detail: {
      xpdlId: "project",
      name: "プロジェクト",
    },
    processes: [createProcess([], created)],
  };
  return project;
}

function createProcess(
  processList: ProcessEntity[],
  created: string = new Date().toISOString(),
): ProcessEntity {
  let id = maxId(processList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `process-${id}`;
  } while (processList.some((it) => it.detail.xpdlId === xpdlId));

  const process: ProcessEntity = {
    id,
    created,
    detail: {
      xpdlId,
      name: `プロセス${id}`,
      validFrom: "",
      validTo: "",
      environments: [],
      applications: [],
    },
    actors: [createActorEntity([])],
    nodes: [],
    edges: [],
  };
  return process;
}

function createEnvironment(environmentList: EnvironmentEntity[]): EnvironmentEntity {
  const id = maxId(environmentList) + 1;
  return {
    id,
    name: `name${id}`,
    value: `value${id}`,
  };
}

function createApplication(applicationList: ApplicationEntity[]): ApplicationEntity {
  let id = maxId(applicationList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `application-${id}`;
  } while (applicationList.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `name${id}`,
    extendedName: "",
    extendedValue: "",
  };
}

function createActorEntity(actorList: ActorEntity[]): ActorEntity {
  let id = maxId(actorList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `actor-${id}`;
  } while (actorList.some((it) => it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    name: `アクター${id}`,
  };
}

function createActivityNode(
  nodeList: INode[],
  actorId: number,
  activityType: ActivityNodeType,
): ActivityNode {
  let id = maxId(nodeList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `activity-${id}`;
  } while (nodeList.some((it) => it.type === "activityNode" && it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type: "activityNode",
    activityType,
    name: "",
    actorId,
    applications: [],
    ognl: "",
    joinType: "notJoin",
    splitType: "notSplit",
    x: 0,
    y: 0,
    width: ACTIVITY_MIN_WIDTH,
    height: 0,
    selected: false,
  };
}

function createTransitionEdge(
  edgeList: IEdge[],
  fromNodeId: number,
  toNodeId: number,
): TransitionEdge {
  let id = maxId(edgeList);
  let xpdlId = "";
  do {
    id++;
    xpdlId = `transition-${id}`;
  } while (edgeList.some((it) => it.type === "transitionEdge" && it.xpdlId === xpdlId));

  return {
    id,
    xpdlId,
    type: "transitionEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createCommentNode(nodeList: INode[], x: number, y: number): CommentNode {
  return {
    id: maxId(nodeList) + 1,
    type: "commentNode",
    comment: "コメント",
    x,
    y,
    width: 0,
    height: 0,
    selected: false,
  };
}

function createCommentEdge(edgeList: IEdge[], fromNodeId: number, toNodeId: number): CommentEdge {
  return {
    id: maxId(edgeList) + 1,
    type: "commentEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createStartNode(nodeList: INode[], x: number, y: number): StartNode {
  return {
    id: maxId(nodeList) + 1,
    type: "startNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createStartEdge(edgeList: IEdge[], fromNodeId: number, toNodeId: number): StartEdge {
  return {
    id: maxId(edgeList) + 1,
    type: "startEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function createEndNode(nodeList: INode[], x: number, y: number): EndNode {
  return {
    id: maxId(nodeList) + 1,
    type: "endNode",
    x,
    y,
    width: NORMAL_ICON_SIZE,
    height: NORMAL_ICON_SIZE,
    selected: false,
  };
}

function createEndEdge(edgeList: IEdge[], fromNodeId: number, toNodeId: number): EndEdge {
  return {
    id: maxId(edgeList) + 1,
    type: "endEdge",
    fromNodeId,
    toNodeId,
    selected: false,
  };
}

function maxId(list: { id: number }[]): number {
  return list.reduce((maxId, it) => Math.max(it.id, maxId), 0);
}

export const dataFactory = {
  createProject,
  createProcess,
  createEnvironment,
  createApplication,
  createActorEntity,
  createActivityNode,
  createTransitionEdge,
  createCommentNode,
  createCommentEdge,
  createStartNode,
  createStartEdge,
  createEndNode,
  createEndEdge,
};
