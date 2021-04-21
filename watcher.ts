import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import command, { Flags } from "./libraries/command.ts";

const DEBOUNCE = 200;
const __dirname = dirname(fromFileUrl(import.meta.url));
const matchers: RegExp[] = [/^(?!\/apps\/).*\.(ts|tsx|json)$/];
const watcher = Deno.watchFs(".", { recursive: true });

const distinct = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

const accumulatingDebouncer = <T>(ms: number) => {
  let lastTimeout = 0;
  let accumulator: T[] = [];
  return function debounced(data: T[], cb: (accumulated: T[]) => void) {
    clearTimeout(lastTimeout);
    accumulator = accumulator.concat(data);
    lastTimeout = setTimeout(() => {
      const accumulated = accumulator.filter(distinct);
      accumulator = [];
      cb(accumulated);
    }, ms);
  };
};

const debounced = accumulatingDebouncer<string>(DEBOUNCE);

command(async (flags) => {
  let main = createWorker(flags);

  for await (const event of watcher) {
    const paths = event.paths.map((p) => p.replace(__dirname, ""));

    debounced(paths, (changedPaths) => {
      const changedFiles = changedPaths.filter((file) =>
        matchers.find((regex) => file.match(regex))
      );
      if (changedFiles.length) {
        console.log("[watcher]", changedFiles);
        main.terminate();
        main = createWorker(flags);
        // main.postMessage({ msg: "FileChange", payload: changedFiles });
      }
    });
  }
});

function createWorker(flags: Flags): Worker {
  const timestamp = +new Date();
  const file = (new URL("./main.ts", import.meta.url).href) + `?t=${timestamp}`;
  const main = new Worker(
    file,
    {
      type: "module",
      deno: {
        namespace: true,
        permissions: {
          net: true,
          read: true,
          run: true,
        },
      },
    },
  );
  main.postMessage({ msg: "Flags", payload: flags });
  return main;
}
