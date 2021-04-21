import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.1/mod.ts";
import pogo from "https://deno.land/x/pogo/main.ts";
// import { lookup } from "https://deno.land/x/media_types/mod.ts";
import { urlParse } from "https://deno.land/x/url_parse/mod.ts";

type ServerCallbacks = {
  onRequestApp: (
    appId: string | null,
    appPath: string | null,
  ) => Promise<string>;
  onRequestInfo: (query: string[]) => Promise<string>;
  onRequestRelease: (info: unknown) => Promise<string>;
  onClientConnects: (wsc: WebSocketClient) => void;
  // onRequestFork: (app: string, newAppName: string) => Promise<string>;
  // onRequestSignals?: () => string;
  // onRequestBranches?: () => string;
  // onRequestSignal?: (sign: string) => string;
  // onRequestBranch?: (branch: string) => string;
  // onRequestWriting?: (branch: string, data: string) => string;
  // onSubscribeToSignalChange?: (
  //   sign: string,
  //   cb: (data: unknown) => void
  // ) => string;
  // onSubscribeToBranchChange?: (
  //   branch: string,
  //   cb: (data: unknown) => void
  // ) => string;
};

export default async function server(
  root: string,
  address: string,
  port: number,
  cb: ServerCallbacks,
) {
  const s = pogo.server({ port, hostname: address });
  console.log("Server started at: ", "http://localhost:8000/");

  // const state = init(root);

  s.router.get("/", async (r) => {
    // console.log(r);
    const url = urlParse(r.href);
    console.log(url);
    const [appId, _] = url.hostname.split(".");

    const params = new URLSearchParams(url.search);

    return await cb.onRequestApp(params.get("app"), params.get("path"));
  });

  const wss = new WebSocketServer(8090);
  wss.on("connection", (wsc: WebSocketClient) => {
    cb.onClientConnects(wsc);
    // wsc.on("message", () => {
    //   wsc.send('reload')
    // })
  });

  await s.start();

  // for await (const req of s) {
  //   console.info("Request: ", req.url);

  //   const url = urlParse(req.url);
  //   req.url
  //   console.log(url);

  //   const headers = new Headers();
  //   headers.set("Content-Type", "text/html");
  //   if (req.url === "/query") {
  //     req.respond({
  //       body: await cb.onRequestInfo(["id", "name", "avatarUrl"]),
  //     });
  //   } else if (req.url === "/release") {
  //     req.respond({ body: await cb.onRequestRelease(req) });
  //   } else if (req.method === "GET" && req.url === "/") {
  //     req.respond({ body: await cb.onRequestApp(req.url) });
  //   }

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
  // }
}
