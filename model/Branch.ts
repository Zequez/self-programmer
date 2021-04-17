import * as path from "https://deno.land/std/path/mod.ts";
import { parse as yamlParse } from "https://deno.land/std/encoding/yaml.ts";
import { Sign } from "./Signal.ts";
import { PublicKey } from "./Identity.ts";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";

export const nextBranchId = (() => {
  let id = 0;
  return () => ++id;
})();

// type Blob = Uint8Array;
// type Link = BranchID;
// export type BranchID = number;

// type Base = {

// }



// type Driver = {
//   identify: (fruit: Fruit) => string[];
//   activate: (fruit: Fruit) => void;
// }

// type FileTypeLabelerDriver

// const yamlLoader = new YamlLoader();
// const YamlDriver: Driver = {
//   identify: (fruit: Fruit) =>
//     (fruit.name.endsWith('.yml') || fruit.name.endsWith('.yaml')) ? ['data'] : [];
//   activate: (fruit: Fruit) => {
//     if (fruit.manifested) {

//       parseYaml(fruit.manifested);
//     }
//   }
// }

// const LoadFromDiskDriver: Driver = {
//   identify: (fruit: Fruit) => fruit.manifested === null ? ['loaded'] : [],
//   activate: (fruit: Fruit) => {}
// }

// const IdentityDriver: Driver = {
//   identify: (fruit: Fruit) =>
//     fruit.name.startsWith('.identity') ? ['identity'] : [],
//   activate: (fruit: Fruit) => {}
// }

// (fruit: Fruit) => {
//   if (fruit.name === '.identity') {
//     return 'identity';
//   }
// }

// const AppDetectionDriver = (fruit: Fruit) => {
//   fruit.name === '.git'
// }

// type LoadersDriver = {
//   // On find files with TSX extension
//   // On find files with Elm extension
// }

// type SelfAware = {
//   origin: Branch | Fruit;
//   // signals: Map<Sign, any>;
//   projection: null | Branch | Fruit;
//   // allowRead: PublicKey[];
//   // allowWrite: PublicKey[];
//   drivers: Driver[];
// }

export type Branch = {
  // id: BranchID;
  // prev: Branch | null;
  name: string;
  location: string;

  // hash: string;
  // body: BranchExpression;
  pathways: null | (Fruit | Branch | Portal)[];
  past: Branch | null;
};

export type Fruit = {
  name: string;
  location: string;
  manifested: null | Uint8Array;
  alternatives: VirtualFruit[];
  past: Branch;
  size: number;
}

export type VirtualFruit = {
  label: string;
  manifested: null | Uint8Array;
  origin: Fruit;
  generator: (fruit: Fruit) => Uint8Array;
}

// type FruitExpression = {
  // observe:
// }

export type Portal = {
  name: string;
  location: string;
  to: string | Branch;
  past: Branch;
}

// type BranchBody = Branch[] | Blob | Link;
// export type BranchMap = Map<BranchID, Branch>;

// export type BranchExpression =
//   | { t: "Blob"; v: null | Uint8Array } // Uint8Array
//   | { t: "Link"; v: string | Branch }
//   | { t: "Parent"; v: null | Branch[] };

// export type Projection =
//   | { to: "virtual"; path: string }
//   | { to: "alternate"; path: string }
//   | { to: "physical"; path: string };

export type BranchInitParams = {
  name: string;
  location: string;
  past: Branch | null;
  // prev: Branch | null;
};

// type Label = string;

// export function explore(branch: Branch, onFindNew: () => ): Branch {

// }

export function explore(root: string): Branch {
  function deepManifestBranch (newBranch: BranchInitParams) {
    return manifestBranch(newBranch, deepManifestBranch);
  }

  if (true) { // Ensure directory exist
    return deepManifestBranch({location: root, name: '', past: null});
  } else {
    throw new Error("Spawning root must be a directory")
  }
}


export function manifestBranch(
  params: BranchInitParams,
  subBranchCallback?: (subBranch: Branch) => Branch
): Branch {
  // const map: BranchMap = new Map();
  // const body: BranchBody = { t: "Branches", v: [] };

  const dirEntries = Deno.readDirSync(params.location);

  let branch: Branch = emptyBranch(params);

  for (const dirEntry of dirEntries) {
    const location = path.join(params.location, dirEntry.name);
    const name = dirEntry.name;
    const past = branch;
    const subParams = {
      physicalPath: path.join(params.location, dirEntry.name),
      name: dirEntry.name,
      prev: branch,
    };

    if (!branch.pathways) branch.pathways = [];

    if (dirEntry.isFile) {
      branch.pathways.push(manifestFruit({name, location, past}));
    } else if (dirEntry.isDirectory) {
      branch.pathways.push(manifestBranch({name, location, past}));
    } else if (dirEntry.isSymlink) {
      branch.pathways.push(manifestPortal({name, location, past, to: ''}));
    }
  }

  return branch;
}

function emptyBranch(params: BranchInitParams): Branch {
  return {
    // id: nextBranchId(),
    // prev: params.prev,
    // path: params.physicalPath,
    name: params.name,
    location: params.location,
    past: params.past,
    pathways: null,
  };
}

function manifestFruit(params: {name: string; location: string; past: Branch}): Fruit {
  return {
    name: params.name,
    location: params.location,
    manifested: null,
    alternatives: [],
    past: params.past,
    size: 0
  }
}

function manifestPortal(params: {name: string, location: string, past: Branch, to: string}): Portal {
    return {
    name: params.name,
    location: params.location,
    to: params.to,
    past: params.past
  }
}
