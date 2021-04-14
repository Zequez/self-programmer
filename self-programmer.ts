import { serve } from "https://deno.land/std/http/server.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const identity = <T>(a: T) => a;
// const SELF_UPDATE = "https://github.com/Zequez/self-programmer";
const SELF_SPAWN = path.dirname(path.fromFileUrl(import.meta.url));
// const ROOT_SPAWN = path.join(SELF_SPAWN, "../");
const nextBranchId = (() => {
  let id = 0;
  return () => ++id;
})();
const rootSpawn = () => program.root || SELF_SPAWN;

// ███╗   ███╗ █████╗ ██╗███╗   ██╗
// ████╗ ████║██╔══██╗██║████╗  ██║
// ██╔████╔██║███████║██║██╔██╗ ██║
// ██║╚██╔╝██║██╔══██║██║██║╚██╗██║
// ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║
// ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝

const program = new Denomander({
  app_name: "Self-programmer",
  app_description: "An app that can self-program and self-serve",
  app_version: "0.0.1",
});

program
  .globalOption("-r --root", "Define the spawning root")
  .command("snapshot", "Analyzes itself and prints a snapshot")
  .action(runSnapshot)
  .command("cli", "Starts the Interactive Self-Programmer command line tool")
  .action(runCli)
  .command("web", "Start the self-programmer web server")
  .option("-a --address", "Define the address", identity, "localhost")
  .option("-p --port", "Define the port", parseInt, 8000)
  .action(runServer)
  .parse(Deno.args);

function runSnapshot() {
  console.log("Running snapshot with", rootSpawn());
  const state = init(rootSpawn());
  // state.tree
  // console.log(JSON.stringify(state.tree, null, 2));
  console.log(JSON.stringify(treeStructureSnapshot(state.tree), null, 2));
  console.log("Initialzed, done");
}

function runCli() {
  console.log("Running CLI with", rootSpawn());
}

async function runServer() {
  console.log(
    "Running web server with",
    rootSpawn(),
    program.address,
    program.port
  );
  const s = serve({ port: 8000 });
  console.log("Server started at: ", "http://localhost:8000/");

  for await (const req of s) {
    console.info("Request: ", req.url);
    req.respond({ body: "{success: true}" });
    // if (req.url === "/api") {
    //   req.respond({ body: "{success: true}" });
    // } else {
    //   // try {
    //   //   const filePath = path.join(ROOT_SPAWN, req.url);
    //   //   const data = await Deno.readFile(filePath);
    //   //   const contentType = lookup(filePath) || "text/plain";
    //   //   const headers = new Headers();
    //   //   headers.set("Content-Type", contentType);
    //   //   req.respond({
    //   //     body: data,
    //   //     headers: headers,
    //   //   });
    //   // } catch (error) {
    //   //   console.error(error);
    //   //   req.respond({ body: "404" });
    //   // }
    // }
  }
}

// ████████╗██╗   ██╗██████╗ ███████╗███████╗
// ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
//    ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
//    ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
//    ██║      ██║   ██║     ███████╗███████║
//    ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝

type PublicKey = string;
type PrivateKey = string;
type Token = string;

type Sign = "IDENTITY" | "PROJECTION_TO" | "SOURCE_FROM" | "APP" | string;

type SubscriptionCallback = (
  value: Map<BranchID, any>,
  changes: Map<BranchID, any>
) => void;

type State = {
  tree: Branch;
  sessions: Map<Token, PublicKey>;
  spawns: Map<PublicKey, Branch>;
  signals: Map<Sign, Map<BranchID, any>>;
  subscriptions: Map<Sign, SubscriptionCallback[]>;
};

// type Tree = {
//   trunk: Branch;
//   root: string;
//   map: Map<BranchID, Tree>;
// };

type Branch = {
  id: BranchID;
  // prev: Branch | null;
  path: string | null;
  name: string;
  projections: Projection[];
  people: PublicKey[];
  // hash: string;
  body: BranchBody;
  map: BranchMap;
};

// type BranchBody = Branch[] | Blob | Link;
type BranchMap = Map<BranchID, Branch>;

type BranchBody =
  | { t: "Unmanifest" }
  | { t: "Blob" } // Uint8Array
  | { t: "Link"; v: BranchID }
  | { t: "Branches"; v: Branch[] };

// type Blob = Uint8Array;
// type Link = BranchID;
type BranchID = number;

type Projection =
  | { to: "virtual"; path: string }
  | { to: "alternate"; path: string }
  | { to: "physical"; path: string };

// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝

function init(rootPath: string): State {
  return {
    tree: manifestBranch({ physicalPath: rootPath, name: "", prev: null }),
    sessions: new Map(),
    spawns: new Map(),
    signals: new Map(),
    subscriptions: new Map(),
  };
}

// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

type BranchForwardParams = {
  physicalPath: string;
  name: string;
  prev: Branch | null;
};

function manifestBranch(params: BranchForwardParams): Branch {
  const map: BranchMap = new Map();
  const body: BranchBody = { t: "Branches", v: [] };

  let dirEntries: Iterable<Deno.DirEntry> = [];
  try {
    dirEntries = Deno.readDirSync(params.physicalPath);
  } catch (e) {
    console.error(
      "Tried to load something that wasn't a directory as a branch",
      e
    );
    throw e;
  }

  const branch = {
    ...emptyBranch(params),
    map,
    body,
  };

  for (const dirEntry of dirEntries) {
    const forwardParams = {
      physicalPath: path.join(params.physicalPath, dirEntry.name),
      name: dirEntry.name,
      prev: branch,
    };

    if (dirEntry.isFile) {
      body.v.push(manifestBlob(forwardParams));
    } else if (dirEntry.isDirectory) {
      body.v.push(manifestBranch(forwardParams));
    } else if (dirEntry.isSymlink) {
      body.v.push(manifestLink(forwardParams));
    }
  }

  map.set(branch.id, branch);

  return branch;
}

function emptyBranch(params: BranchForwardParams): Branch {
  return {
    id: nextBranchId(),
    // prev: params.prev,
    path: params.physicalPath,
    name: params.name,
    projections: [],
    people: [],
    body: { t: "Unmanifest" },
    map: new Map(),
  };
}

function manifestBlob(params: BranchForwardParams): Branch {
  const branch = {
    ...emptyBranch(params),
    body: { t: "Blob" } as BranchBody,
    // Deno.readFileSync(params.physicalPath),
  };
  return branch;
}

function manifestLink(params: BranchForwardParams): Branch {
  return emptyBranch(params); // TODO
}

function fetchSignals(state: State, word: string): Map<BranchID, any> {
  return state.signals.get(word) || new Map();
}

function fetchBlob(
  state: State,
  root: string[],
  path: string[]
): null | Branch {
  // const pathStops = path.replace(/^\//, '').split('/');
  const sessionRoot = walkTo(state.tree, state.tree, root);
  if (sessionRoot) {
    return walkTo(sessionRoot, sessionRoot, path);
  } else {
    return null;
  }
}

function walkTo(
  root: Branch,
  branch: Branch,
  path: string[],
  linksTaken: string[] = []
): Branch | null {
  return path.reduce<Branch | null>((branch, name) => {
    if (branch === null) return null;

    if (Array.isArray(branch.body)) {
      for (const part of branch.body) {
        if (typeof part === "string") {
          if (name === branch.name) {
            return branch;
          }
        } else if (Array.isArray(part)) {
          const linkPath = part.join("/");
          if (linksTaken.indexOf(linkPath) === -1) {
            linksTaken.push(linkPath); // WARNING - Mutability
            return walkTo(root, root, part, linksTaken);
          } else {
            return null;
          }
        } else {
          return walkTo(root, part, path.slice(1));
        }
      }
    }

    return null;
  }, branch);
}

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
