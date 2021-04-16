import * as path from "https://deno.land/std/path/mod.ts";
import Denomander, { Option } from "https://deno.land/x/denomander/mod.ts";
import { identity } from "./utils.ts";

export type Flags = {
  address: string;
  port: number;
  root: string;
  mode: Mode;
};

type Mode = "cli" | "snapshot" | "web";

const rootPath = new Option({
  flags: "-r --root",
  description: "Define the spawning root",
  defaultValue: path.dirname(path.fromFileUrl(import.meta.url)),
});

export default (init: (options: Flags) => void) => {
  const program = new Denomander({
    app_name: "Self-programmer",
    app_description: "An app that can self-program and self-serve",
    app_version: "0.0.1",
  });

  const initAs = (mode: Mode) => () => {
    const { address, port, root } = program;
    init({ address, port, root, mode });
  };

  program
    .globalOption("-r --root", "Define the spawning root")
    .command("snapshot", "Analyzes itself and prints a snapshot")
    .addOption(rootPath)
    .action(initAs("snapshot"))
    .command("cli", "Starts the Interactive Self-Programmer command line tool")
    .addOption(rootPath)
    .action(initAs("cli"))
    .command("web", "Start the self-programmer web server")
    .addOption(rootPath)
    .option("-a --address", "Define the address", identity, "localhost")
    .option("-p --port", "Define the port", parseInt, 8000)
    .action(initAs("web"))
    .parse(Deno.args);
};
