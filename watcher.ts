import { dirname, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import command, { Flags } from "./libraries/command.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";

const WAIT_FOR_SHUTDOWN = 1000;
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

const log = (...msg: unknown[]) =>
  console.log(Colors.blue("[watcher]"), ...msg);

command(async (flags) => {
  let main: Worker;
  let shuttingDown = false;

  function recreateWorker() {
    main = createWorker(flags);
    shuttingDown = false;
  }

  recreateWorker();

  for await (const event of watcher) {
    const paths = event.paths.map((p) => p.replace(__dirname, ""));

    debounced(paths, (changedPaths) => {
      if (!shuttingDown) {
        const changedFiles = changedPaths.filter((file) =>
          matchers.find((regex) => file.match(regex))
        );
        if (changedFiles.length) {
          log(changedFiles);
          main.postMessage({ msg: "FileChange", payload: changedFiles });

          shuttingDown = true;
          log("Restarting main worker...");
          log("Sending shutdown signal, waiting 1 second");

          main.postMessage({ msg: "Shutdown" });
          const shutdownTimer = setTimeout(() => {
            console.log("Timer elapsed, no signal, forcing a shutdown");
            main.terminate();
            recreateWorker();
          }, WAIT_FOR_SHUTDOWN);

          main.addEventListener("message", ({ data }) => {
            if (data.msg === "ReadyToShutdown") {
              clearTimeout(shutdownTimer);
              console.log("Received signal that worker is ready to shutdown");
              main.terminate();
              recreateWorker();
            }
          });
        }
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
