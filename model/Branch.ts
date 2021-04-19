import * as path from "https://deno.land/std/path/mod.ts";
import { parse as yamlParse } from "https://deno.land/std/encoding/yaml.ts";

type Entity = {
  name: string;
  location: string;
  data: Record<string, unknown>;
  dataTimestamp: null | number;
};

export type Branch = Entity & {
  pathways: { [key: string]: (Fruit | Branch | Portal) };
  past: Branch | null;
};

export function isBranch(branch: Branch | Portal | Fruit): branch is Branch {
  return branch && ((<Branch> branch).pathways !== undefined);
}

export function isFruit(fruit: Branch | Portal | Fruit): fruit is Fruit {
  return (<Fruit> fruit).manifested !== undefined;
}

export function awakenBranch(branch: Branch) {
  if (branch.dataTimestamp !== null) return;
  const currentTimestamp = +new Date();

  // const watcher = Deno.watchFs(branch.location);

  Object.keys(branch.pathways).map((name) => {
    const entity = branch.pathways[name];
    if (isFruit(entity)) {
      if (entity.name.endsWith(".yml")) {
        const ID = entity.name.replace(/\.yml$/, "");
        entity.data = {
          ...(yamlParse(Deno.readTextFileSync(entity.location)) ||
            {}) as Record<string, unknown>,
          id: ID,
        };
        entity.dataTimestamp = currentTimestamp;
        branch.data[ID] = entity.data;
      } else {
        console.warn("Could not load entity", entity.name);
      }
    }
  });

  branch.dataTimestamp = currentTimestamp;
}

// function loadFruit(fruit: Fruit) {
//   fruit.manifested = Deno.file;
// }

export type Fruit = Entity & {
  manifested: null | Uint8Array;
  past: Branch;
  size: number;
};

export type Portal = Entity & {
  to: string | Branch;
  past: Branch;
};

export function explore(root: string): Branch {
  return manifestBranch({ location: root, name: "", past: null });
}

export function manifestBranch(
  params: { name: string; location: string; past: Branch | null },
): Branch {
  const branch: Branch = {
    name: params.name,
    location: params.location,
    data: {},
    dataTimestamp: null,
    past: params.past,
    pathways: {},
  };

  const dirEntries = Deno.readDirSync(params.location);

  for (const dirEntry of dirEntries) {
    const name = dirEntry.name;
    const location = path.join(params.location, name);
    if (!branch.pathways) branch.pathways = {};
    branch.pathways[name] = manifestEntity(dirEntry, location, branch);
  }

  return branch;
}

function manifestEntity(
  dirEntry: Deno.DirEntry,
  location: string,
  past: Branch,
): Branch | Fruit | Portal {
  const name = dirEntry.name;

  if (dirEntry.isDirectory) {
    return manifestBranch({ name, location, past });
  } else if (dirEntry.isFile) {
    return manifestFruit({ name, location, past });
  } else if (dirEntry.isSymlink) {
    const to = Deno.readLinkSync(path.join(location, name));
    return manifestPortal({ name, location, past, to });
  } else {
    throw new Error("What kind of file is this?");
  }
}

function manifestFruit(
  params: { name: string; location: string; past: Branch },
): Fruit {
  return {
    name: params.name,
    location: params.location,
    data: {},
    dataTimestamp: null,
    manifested: null,
    past: params.past,
    size: 0,
  };
}

function manifestPortal(
  params: { name: string; location: string; past: Branch; to: string },
): Portal {
  return {
    name: params.name,
    location: params.location,
    data: {},
    dataTimestamp: null,
    to: params.to,
    past: params.past,
  };
}
