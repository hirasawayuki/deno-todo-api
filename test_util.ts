import { BufReader, BufWriter, Buffer } from "./test_deps.ts";
import { ServerRequest } from "./deps.ts";

interface MockServerRequestOptions {
  url?: string;
  host?: string;
  body?: string;
  method?: string;
  headerValues?: Record<string, string>;
}

function createMockBodyReader(body: string): Deno.Reader {
  const encoder = new TextEncoder();
  const buf = encoder.encode(body);
  let offset = 0;
  return {
    async read(p: Uint8Array): Promise<number | null> {
      if (offset >= buf.length) {
        return await new Promise((resolve) => resolve(null));
      }
      const chunkSize = Math.min(p.length, buf.length - offset);
      p.set(buf);
      offset += chunkSize;
      return await new Promise((resolve) => resolve(chunkSize));
    }
  };
}

export function createMockServerRequest(
  {
    url = "/",
    host = "localhost",
    body = "",
    method = "GET",
    headerValues = {}
  }: MockServerRequestOptions = {},
): ServerRequest {
  const headers = new Headers();
  headers.set("host", host);
  for (const [key, value] of Object.entries(headerValues)) {
    headers.set(key, value);
  }
  if (body.length && !headers.has("content-length")) {
    headers.set("content-length", String(body.length));
  }
  return {
    conn: {
      localAddr: { transport: "tcp", hostname: "localhost", port: 8000 },
      remoteAddr: { transport: "tcp", hostname: "remote", port: 4567 },
      rid: 1,
    } as Deno.Conn,
    headers,
    method,
    url,
    body: createMockBodyReader(body),
    r: new BufReader(new Buffer(new Uint8Array())),
    w: new BufWriter(new Buffer(new Uint8Array())),
    async respond() {},
  };
}
