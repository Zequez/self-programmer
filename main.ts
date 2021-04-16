import * as path from "https://deno.land/std/path/mod.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";

import { lookup } from "https://deno.land/x/media_types/mod.ts";

import { PublicKey, PrivateKey, Token } from "./model/Identity.ts";
import {
  Branch,
  Fruit,
  Portal,
  BranchID,
  BranchMap,
  BranchBody,
  manifestBranch,
} from "./model/Branch.ts";
import { Sign } from "./model/Signal.ts";
import commander, { Flags } from "./command.ts";
import { identity } from "./utils.ts";
import server from "./server.ts";
import ui from "./ui.tsx";

// const ROOT_SPAWN = path.join(SELF_SPAWN, "../");
// const SELF_UPDATE = "https://github.com/Zequez/self-programmer";

const SELF_SPAWN = path.dirname(path.fromFileUrl(import.meta.url));

// const rootSpawn = (): string => program.root || SELF_SPAWN;
const SCANNERS: Scanner[] = [scanHtml];

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝

commander((params) => {
  const state = init(params);

  if (params.mode === "snapshot") {
    // runSnapshot(state);
  } else if (params.mode === "cli") {
    // runCli(state);
  } else if (params.mode === "web") {
    runWeb(state);
  }
});

function init(flags: Flags): State {
  const tree = manifestBranch({
    physicalPath: flags.root,
    name: "",
    prev: null,
  });
  const signals = collectSignals(tree);
  const branchesMap = collectBranches(tree);
  return {
    flags,
    tree,
    sessions: new Map(),
    spawns: new Map(),
    signals,
    subscriptions: new Map(),
    map: branchesMap,
  };
}

// function runSnapshot(state: State) {
//   console.log("Running snapshot with", program.root);
//   const state = init(program.root);
//   // state.tree
//   // console.log(JSON.stringify(state.tree, null, 2));
//   // console.log(JSON.stringify(treeStructureSnapshot(state.tree), null, 2));
//   console.log("Initialized, done");
//   console.log(state.signals);
//   // console.log(JSON.stringify(state.signals, null, 2));
// }

// function runCli(state: State) {
//   console.log("Running CLI with", program.root);
// }

function runWeb(state: State) {
  console.log("Running server");
  server(state.location, state.host, state.port, {
    onRequestFruit: (location: string) => {},
    onRequestLabel: (label: string) => {},
    onSubscribeToLabelChange: () => {},
    onSubscribeToFruitChange: () => {},
  });
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

// ████████╗██╗   ██╗██████╗ ███████╗███████╗
// ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
//    ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
//    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
//    ██║      ██║   ██║     ███████╗███████║
//    ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝

type SubscriptionCallback = (
  value: Map<BranchID, any>,
  changes: Map<BranchID, any>
) => void;

type AvatarName = string;

type State = {
  // Center
  origin: string;
  location: string;
  present: Branch;

  // Server
  host: string;
  port: number;

  // Known & Loaded Information
  memory: Map<string, Branch | Fruit | Portal>;
  labels: Map<string, Fruit[]>;
  labelsActions: Map<string, LabelAction>;

  // Players Identity
  avatars: Map<AvatarName, Fruit>;
  sessions: Map<Token, AvatarName>;
  avatarKeys: Map<AvatarName, PublicKey>;
  keysRenewAt: Map<PublicKey, number>;
};

function onFruitChange(state: State, fruit: Fruit) {
  // const branch = state.memory.get(fruit.past.location)!;
  // fruit
}

function onLabelChange();

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

type Scanner = (branch: Branch) => Branch;

function scanAll(branch: Branch): Branch {
  for (const scanner of SCANNERS) {
    branch = scanner(branch);
  }
  return branch;
}

function scanHtml(branch: Branch): Branch {
  // console.log(branch.name);
  if (branch.name.endsWith(".html")) {
    console.log("HTML!", branch.name, branch.path);
    branch.signals.set("html", null);
  } else {
    branch.signals.delete("html");
  }
  return branch;
}

// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

function collectBranches(
  branch: Branch,
  globalMap: Map<BranchID, Branch> = new Map()
): Map<BranchID, Branch> {
  globalMap.set(branch.id, branch);
  if (branch.body.t === "Branches") {
    branch.body.v.forEach((subBranch) => {
      collectBranches(subBranch, globalMap);
    });
  }
  return globalMap;
}

function collectSignals(
  branch: Branch,
  globalMap: SignalsBranchMap = new Map()
): SignalsBranchMap {
  branch.signals.forEach((value, sign) => {
    const branchIdValueMap: Map<BranchID, any> =
      globalMap.get(sign) || new Map();
    branchIdValueMap.set(branch.id, value);
    globalMap.set(sign, branchIdValueMap);
  });

  if (branch.body.t === "Branches") {
    for (const subBranch of branch.body.v) {
      collectSignals(subBranch, globalMap);
    }
  }

  return globalMap;
}

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

type StringTree = { [key: string]: StringTree | string };

function treeStructureSnapshot(branch: Branch): StringTree | string {
  if (branch.body.t === "Branches") {
    const stringTree: StringTree = {};
    for (const subBranch of branch.body.v) {
      stringTree[subBranch.name] = treeStructureSnapshot(subBranch);
    }
    return stringTree;
  } else {
    return `!${branch.body.t}`;
  }
}

// ----------------------------

// Deno.stat
