// type StaticDriver {
//   path: string;
// }

import { Branch, explore, Fruit } from "../model/Branch.ts";

type Params = {
  entrypoint: string;
  onChange: (fruits: Fruit[]) => void;
};

type State = {
  branch: Branch;
};

class StaticDriver {
  entrypoint: string;
  // fruits: Fruit[];
  branch: Branch;

  constructor(entrypoint: string) {
    this.entrypoint = entrypoint;
    this.branch = explore(entrypoint);
    // this.fruits = extractFruits(this.branch);
  }

  onBranchChange() {
    console.log("");
  }

  onFruitChange() {
  }

  onLinkChange() {
  }
}

export default StaticDriver;
