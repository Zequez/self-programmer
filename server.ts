import { serve } from "https://deno.land/std/http/server.ts";
// import { lookup } from "https://deno.land/x/media_types/mod.ts";

type ServerCallbacks = {
  onRequestUi?: () => Promise<string>;
  onRequestSignals?: () => string;
  onRequestBranches?: () => string;
  onRequestSignal?: (sign: string) => string;
  onRequestBranch?: (branch: string) => string;
  onRequestWriting?: (branch: string, data: string) => string;
  onSubscribeToSignalChange?: (
    sign: string,
    cb: (data: unknown) => void
  ) => string;
  onSubscribeToBranchChange?: (
    branch: string,
    cb: (data: unknown) => void
  ) => string;
};

export default async function server(
  root: string,
  address: string,
  port: number,
  cb: ServerCallbacks
) {
  console.log("Starting self-programmer web server");
  const s = serve({ port: 8000 });
  console.log("Server started at: ", "http://localhost:8000/");

  // const state = init(root);

  for await (const req of s) {
    console.info("Request: ", req.url);

    const headers = new Headers();
    headers.set("Content-Type", "text/html");
    req.respond({ body: (cb.onRequestUi && (await cb.onRequestUi())) || "" });

    // if (req.url === "/api") {
    //   req.respond({ body: "{success: true}" });
    // } else {
    //   try {
    //     // const filePath = path.join(ROOT_SPAWN, req.url);
    //     // const data = await Deno.readFile(filePath);
    //     // const contentType = lookup(filePath) || "text/plain";
    //     const headers = new Headers();
    //     // headers.set("Content-Type", contentType);
    //     let view = "";
    //     state.signals.forEach((branchesMap, sign) => {
    //       view += `${sign}\n`;
    //       branchesMap.forEach((data, branchId) => {
    //         const branch = state.map.get(branchId);
    //         const relativePath = branch && branchRelativePath(branch);
    //         view += `   ${relativePath} => ${data}\n`;
    //       });
    //     });
    //     req.respond({
    //       body: view,
    //       headers: headers,
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     req.respond({ body: "404" });
    //   }
  }
}
