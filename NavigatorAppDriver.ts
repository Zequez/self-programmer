import * as path from "https://deno.land/std/path/mod.ts";
import { readLines } from "https://deno.land/std@0.92.0/io/mod.ts";
import { onExit } from "https://deno.land/x/exit/mod.ts";
import { writeAll } from "https://deno.land/std/io/util.ts";

async function pipeThrough(
  prefix: string,
  reader: Deno.Reader,
  writer: Deno.Writer,
  cb?: (line: string) => void,
) {
  const encoder = new TextEncoder();
  for await (const line of readLines(reader)) {
    if (cb) cb(line);
    await writeAll(writer, encoder.encode(`[${prefix}] ${line}\n`));
  }
}

export default class NavigatorAppDriver {
  name!: string;
  location!: string;
  watchProcess: Deno.Process | null = null;
  processing = false;
  finishingQueue: ((success: boolean) => void)[] = [];

  constructor(name: string, appLocation: string) {
    this.name = name;
    this.location = appLocation;
  }

  ensureWatcher(onBundleReady: (success: boolean) => void) {
    if (this.watchProcess === null) {
      this.watchProcess = Deno.run({
        cmd: `bundler bundle main.html=index.html --watch`.split(" "),
        cwd: this.location,
        stdout: "piped",
        stderr: "piped",
      });

      if (this.watchProcess.stdout && this.watchProcess.stderr) {
        // Pipe every output from the bundler to the main process with the [navigator] prefix
        pipeThrough(
          this.name,
          this.watchProcess.stdout,
          Deno.stdout,
          (line: string) => {
            // Read process output lines to check for bundling events
            if (line.match(/Process terminated/i)) {
              this.processing = false;
              this.finishingQueue.forEach((cb) => cb(true));
              this.finishingQueue = [];
            } else if (line.match(/File change detected/i)) {
              this.processing = true;
            }
          },
        );
        pipeThrough(this.name, this.watchProcess.stderr, Deno.stderr);
      }

      // When the process ends unexpectedly
      this.watchProcess.status().then(() => {
        console.log("Process ending...");
        this.watchProcess = null;
        this.processing = false;
        this.finishingQueue.forEach((cb) => cb(false));
      });
    } else {
      if (this.processing === false) {
        onBundleReady(true);
      } else {
        this.finishingQueue.push(onBundleReady);
      }
    }
  }

  readFile(filePath: string): string {
    return Deno.readTextFileSync(path.join(this.location, "dist", filePath));
  }

  fetch(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ensureWatcher((success) => {
        if (success) {
          try {
            resolve(this.readFile(filePath));
          } catch (e) {
            reject("File reading error");
          }
        } else {
          reject("Bundling error");
        }
      });
    });
  }

  close() {
    if (this.watchProcess) this.watchProcess.close();
  }
}
