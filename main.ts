import * as path from "https://deno.land/std/path/mod.ts";
import * as fs from "https://deno.land/std/fs/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { parse as yamlParse } from "https://deno.land/std/encoding/yaml.ts";
import { Participant } from "./apps/identity/Participant.ts";
import { pick } from "./libraries/utils.ts";
import NavigatorAppDriver from "./NavigatorAppDriver.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.1/mod.ts";
// import watch from "https://deno.land/x/watch@1.1.0/mod.ts";

// import { PublicKey, PrivateKey, Token } from "./model/Identity.ts";
import {
  awakenBranch,
  Branch,
  explore,
  Fruit,
  isBranch,
  isFruit,
  manifestBranch,
  Portal,
} from "./model/Branch.ts";
// import { Sign } from "./model/Signal.ts";
import { Flags } from "./libraries/command.ts";
// import { identity } from "./utils.ts";
import server from "./libraries/server.ts";

// const ROOT_SPAWN = path.join(SELF_SPAWN, "../");
// const SELF_UPDATE = "https://github.com/Zequez/self-programmer";

// const SELF_SPAWN = path.dirname(path.fromFileUrl(import.meta.url));

// const rootSpawn = (): string => program.root || SELF_SPAWN;
// const SCANNERS: Scanner[] = [scanHtml];

// ████████╗██╗   ██╗██████╗ ███████╗███████╗
// ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
//    ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
//    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
//    ██║      ██║   ██║     ███████╗███████║
//    ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝

type State = {
  rootApp: string;

  // Center
  origin: string;
  location: string;
  present: Branch;

  // Information
  participants: Map<string, Participant>;
  apps: Map<string, Branch>;

  // Server
  host: string;
  port: number;

  appsDrivers: Record<string, NavigatorAppDriver>;
  //   // Known & Loaded Information
  //   memory: Map<string, Branch | Fruit | Portal>;
  //   labels: Map<string, Fruit[]>;
  //   labelsActions: Map<string, LabelAction>;

  //   // Players Identity
  //   avatars: Map<AvatarName, Fruit>;
  //   sessions: Map<Token, AvatarName>;
  //   avatarKeys: Map<AvatarName, PublicKey>;
  //   keysRenewAt: Map<PublicKey, number>;
};

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝

type ParentMsg = { msg: "Flags"; payload: Flags } | { msg: "Shutdown" };
type ChildMsg = { msg: "ReadyToShutdown" };

declare global {
  interface Window {
    onmessage: (ev: MessageEvent) => void;
    postMessage: (ev: ChildMsg) => void;
  }
}

self.onmessage = ({ data }: MessageEvent<ParentMsg>) => {
  // console.log("RECEIVED MESSAGE!", ev);
  if (data.msg === "Flags") {
    init(data.payload);
  } else if (data.msg === "Shutdown") {
    console.log("Shutting down...");
    setTimeout(() => {
      self.postMessage({ msg: "ReadyToShutdown" });
    }, 500);
  }
};

// type App = {
//   location: string;
//   buildCommand: null | string;
//   watchCommand: null | string;
//   watchingProcessId: null | number;
//   checkUpdate: () => Promise<boolean>;
//   update: () => Promise<boolean>;
//   fetchFile: (path: string) => Promise<string>;
// };

// onExit(() => {
//   if (navigatorAppWatcher) {
//     navigatorAppWatcher.close();
//   }
// });

// class AppDriver {
//   // entrypoint: 'index.html',
//   // watch: '',
//   // build: '',
//   async function get (path: string) {

//   }

//   async function set(path: string, data: string) {

//   }
// }

// async function getAppFile(app: App) {
//   app.location
// }

// const availableApps = {
//   navigator:
// }

function init(params: Flags): void {
  const tree = explore(params.root);

  const origin = path.dirname(path.fromFileUrl(import.meta.url));

  const state: State = {
    rootApp: "navigator",

    // flags,
    origin,
    location: params.root,
    present: tree,

    apps: new Map(),
    participants: new Map(),

    appsDrivers: {
      navigator: new NavigatorAppDriver(
        "navigator",
        path.join(origin, "apps", "navigator"),
      ),
    },

    // Server
    host: params.address,
    port: params.port,
    // // Known & Loaded Information
    // memory: Map<string, Branch | Fruit | Portal>;
    // labels: Map<string, Fruit[]>;
    // labelsActions: Map<string, LabelAction>;

    // // Players Identity
    // avatars: Map<AvatarName, Fruit>;
    // sessions: Map<Token, AvatarName>;
    // avatarKeys: Map<AvatarName, PublicKey>;
    // keysRenewAt: Map<PublicKey, number>;
  };

  // Load apps
  // const appsBranch = state.present.pathways.apps as Branch;
  // Object.keys(appsBranch.pathways).forEach((appName) => {
  //   const appBranch = appsBranch.pathways[appName];
  //   if (isBranch(appBranch) && isBranch(appBranch.pathways.participants)) {
  //     console.log(
  //       Colors.green("Loading with agent driver"),
  //       appBranch.location,
  //     );
  //     const participantsBranch = appBranch.pathways.participants;
  //     awakenBranch(participantsBranch);
  //     for (const key in participantsBranch.data) {
  //       const existing = state.participants.get(key) || {};
  //       const current = participantsBranch.data[key] as Participant;
  //       state.participants.set(key, { ...existing, ...current });
  //     }
  //     state.apps.set(appBranch.name, appBranch);
  //   } else {
  //     console.warn(
  //       Colors.yellow("Couldn't find app driver"),
  //       appBranch.location,
  //     );
  //   }
  // });

  // console.log(
  //   "Participants: ",
  //   JSON.stringify(Object.fromEntries(state.participants), null, 2),
  // );

  // function branchWalkToPath();

  server(state.location, state.host, state.port, {
    onRequestApp: (appId: string | null, appPath: string | null) => {
      console.log("App ID:", appId);
      console.log("App Path:", appPath);
      if (appId === null || appId === "/") appId = "navigator";
      if (appPath === null || appPath === "/") appPath = "index.html";

      const appLocation = path.join(state.origin, "apps", appId);

      console.log(appId, appPath);

      const appDriver = state.appsDrivers[appId];

      if (appDriver) {
        return appDriver.fetch(appPath);
      } else {
        return Promise.resolve(
          "<html><body>Could not find app with that name</body></html>",
        );
      }

      // (state.present.pathways.apps as Branch).pathways;
      // if (appLocation === '/') {
      //   // let appId = state.rootApp;
      // } else if ()
      // const appLocation = state.apps.get(
      //   appReq === "/" ? state.rootApp : appReq.replace(/^\//, ""),
      // );
      // const appFile = app
      // console.log(app);

      // if (app) {
      //   // Does the app needs to bundle?
      //   // Is it already bundled?
      //   // What is the entrypoint for the browser?
      //   // What is the perspective of the app we are using?

      //   const index = app.pathways["index.html"];
      //   if (index && isFruit(index)) {
      //     const html = Deno.readTextFileSync(index.location);
      //     return Promise.resolve(html);
      //   }
      // }
      // return Promise.resolve(
      //   "<html><body>Could not find app with that name</body></html>",
      // );
    },
    onClientConnects: (wsc: WebSocketClient) => {
      console.log("Web socket client connected");
    },
    onRequestInfo: (query: string[]) => {
      const keys = <(keyof Participant)[]> query;
      const result: typeof state.participants = new Map();
      state.participants.forEach((participant, id) => {
        result.set(id, pick(participant, keys) as Participant);
      });

      return Promise.resolve(
        JSON.stringify(Object.fromEntries(result), null, 2),
      );
    },
    onRequestRelease: (info: unknown) => {
      return Promise.resolve("true");
    },
  });
}

function readParticipantsFromStore(
  participantsPath: string,
): Map<string, Participant> {
  const participants = new Map<string, Participant>();
  const participantsEntries = Deno.readDirSync(participantsPath);

  for (const participantEntry of participantsEntries) {
    if (
      participantEntry.isFile && participantEntry.name.endsWith(".yml")
    ) {
      const ID = participantEntry.name.replace(/\.yml$/, "");

      const readParticipant = (yamlParse(
        Deno.readTextFileSync(
          path.join(participantsPath, participantEntry.name),
        ),
      ) || {}) as Participant;

      if (readParticipant.id && readParticipant.id !== ID) {
        console.warn("ID of participant doesn't match file name");
      }

      readParticipant.id = ID;

      participants.set(ID, readParticipant);
    } else {
      console.warn("Participants should be stored as yml files");
    }
  }

  return participants;
}

function queryByFlatLabels(
  state: State,
  participants: string[],
  query: string[],
) {
  const result: Record<string, unknown> = {};
  const branch = state.present;
  state.participants;
  query.forEach((q) => {
    if (branch.data[q] !== undefined) {
      result[q] = branch.data[q];
    }
  });
  return result;
}

// type LabelStatus = 'started' | 'changed' | 'ended';
// const label: (label: string, branch: string, status: LabelStatus) => {

// }

// type LabelReaction = (label: string, fruit: Fruit, status: LabelStatus) => void;
// type FruitProcessor = (fruit: Fruit) => void;

// type Module = {
//   onLoad: () => void;
//   onUnload: () => void;
//   watchLabels: string[];
//   entryPoints: Fruit[];
//   onFruitFound: (fruit: Fruit) => void;
//   onFruitChange: (fruit: Fruit) => void;
//   onFruitLost: (fruit: Fruit) => void;
//   onLabelFound: (label: string, )
//   onLabelChange: (label: string, fruits: Fruit[]) => void;
// }

// function branchRelativePath(branch: Branch): string {
//   const path: string[] =
//     branch.path?.replace(rootSpawn() + "/", "").split("/") || [];

//   return path.join("/");
// }

// type SubscriptionCallback = (
//   value: Map<BranchID, any>,
//   changes: Map<BranchID, any>
// ) => void;

// type AvatarName = string;

// function onFruitChange(state: State, fruit: Fruit) {
//   // const branch = state.memory.get(fruit.past.location)!;
//   // fruit
// }

// function onLabelChange();

// function onLabelChange(state: State, label: string): State {

//   state.labelsActions.map((labelAction) => {

//   })
// }

// ███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ ███████╗
// ██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗██╔════╝
// ███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝███████╗
// ╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗╚════██║
// ███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║███████║
// ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚══════╝

// type Scanner = (branch: Branch) => Branch;

// function scanAll(branch: Branch): Branch {
//   for (const scanner of SCANNERS) {
//     branch = scanner(branch);
//   }
//   return branch;
// }

// function scanHtml(branch: Branch): Branch {
//   // console.log(branch.name);
//   if (branch.name.endsWith(".html")) {
//     console.log("HTML!", branch.name, branch.path);
//     branch.signals.set("html", null);
//   } else {
//     branch.signals.delete("html");
//   }
//   return branch;
// }

// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

// function collectBranches(
//   branch: Branch,
//   globalMap: Map<BranchID, Branch> = new Map()
// ): Map<BranchID, Branch> {
//   globalMap.set(branch.id, branch);
//   if (branch.body.t === "Branches") {
//     branch.body.v.forEach((subBranch) => {
//       collectBranches(subBranch, globalMap);
//     });
//   }
//   return globalMap;
// }

// function collectSignals(
//   branch: Branch,
//   globalMap: SignalsBranchMap = new Map()
// ): SignalsBranchMap {
//   branch.signals.forEach((value, sign) => {
//     const branchIdValueMap: Map<BranchID, any> =
//       globalMap.get(sign) || new Map();
//     branchIdValueMap.set(branch.id, value);
//     globalMap.set(sign, branchIdValueMap);
//   });

//   if (branch.body.t === "Branches") {
//     for (const subBranch of branch.body.v) {
//       collectSignals(subBranch, globalMap);
//     }
//   }

//   return globalMap;
// }

// function fetchSignals(state: State, word: string): Map<BranchID, any> {
//   return state.signals.get(word) || new Map();
// }

// function fetchBlob(
//   state: State,
//   root: string[],
//   path: string[]
// ): null | Branch {
//   // const pathStops = path.replace(/^\//, '').split('/');
//   const sessionRoot = walkTo(state.tree, state.tree, root);
//   if (sessionRoot) {
//     return walkTo(sessionRoot, sessionRoot, path);
//   } else {
//     return null;
//   }
// }

// function walkTo(
//   root: Branch,
//   branch: Branch,
//   path: string[],
//   linksTaken: string[] = []
// ): Branch | null {
//   return path.reduce<Branch | null>((branch, name) => {
//     if (branch === null) return null;

//     if (Array.isArray(branch.body)) {
//       for (const part of branch.body) {
//         if (typeof part === "string") {
//           if (name === branch.name) {
//             return branch;
//           }
//         } else if (Array.isArray(part)) {
//           const linkPath = part.join("/");
//           if (linksTaken.indexOf(linkPath) === -1) {
//             linksTaken.push(linkPath); // WARNING - Mutability
//             return walkTo(root, root, part, linksTaken);
//           } else {
//             return null;
//           }
//         } else {
//           return walkTo(root, part, path.slice(1));
//         }
//       }
//     }

//     return null;
//   }, branch);
// }

// type StringTree = { [key: string]: StringTree | string };

// function treeStructureSnapshot(branch: Branch): StringTree | string {
//   if (branch.body.t === "Branches") {
//     const stringTree: StringTree = {};
//     for (const subBranch of branch.body.v) {
//       stringTree[subBranch.name] = treeStructureSnapshot(subBranch);
//     }
//     return stringTree;
//   } else {
//     return `!${branch.body.t}`;
//   }
// }

// ----------------------------

// Deno.stat
