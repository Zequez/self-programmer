import * as path from "https://deno.land/std/path/mod.ts";
import Denomander from "https://deno.land/x/denomander/mod.ts";
import { identity } from "./utils.ts";

export type Flags = {
  address: string;
  port: number;
  root: string;
};

export default (init: (options: Flags) => void) => {
  const program = new Denomander({
    app_name: "Self-programmer",
    app_description: "An app that can self-program and self-serve",
    app_version: "0.0.1",
  });

  program
    .command("start", "Start the self-programmer")
    .option("-a --address", "Define the address", identity, "localhost")
    .option("-p --port", "Define the port", parseInt, 8000)
    .option(
      "-r --root",
      "Define the spawning root",
      identity,
      path.join(path.dirname(path.fromFileUrl(import.meta.url)), "../"),
    )
    .action(() => {
      const { address, port, root } = program;
      init({ address, port, root });
    })
    .parse(Deno.args);
};
