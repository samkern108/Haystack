import { Innertube } from "youtubei.js/web";
import { PROXY_SERVER_URL } from "../config/server.ts";

/* Using 
 *   https://github.com/LuanRT/googlevideo/blob/main/examples/sabr-shaka-example/src/main.ts and
 *   https://github.com/LuanRT/googlevideo/blob/main/examples/sabr-shaka-example/src/helpers.ts
 * as a guide, as per the recommendation of the Youtube.js guide (https://ytjs.dev/guide/browser-usage)
 *
 * However, should be noted that this example requires the use of a separate browser extension (ytc-bridge) to bypass CORS for cross-site Youtube requests.
 *   In particular, it exposes a "proxyFetch" function which proxies requests to youtube through said extension. (https://github.com/LuanRT/ytc-bridge/blob/main/src/injected.ts)
 * This might make this example unhelpful for us if we cannot replicate this proxied fetch functionality without an extension.
 *
 * There is also an older example the guide makes available, which actually tangles with CORS: https://github.com/LuanRT/YouTube.js/blob/main/examples/browser/proxy/deno.ts
 * This might be a better path for us to pursue.
 * Hmm, this also seems to require some sort of proxied server running separately.
 *
 * Currently trying to get it to work through CORS alone, at the very least so I can understand what problem it is that this extension/proxy server is solving.
 *
 * Okay... figured it out, and yes we do need to proxy these requests.
 * Problem is, Innertube does not allow any cross-site requests, it is missing the Access-Control-Allow-Origin header which would allow these to succeed.
 *   Makes sense, I suppose, it is supposed to be Youtube's private API.
 * Instead, we will need a backend server running which makes these requests on our behalf. The second (older) example above shows how to do this.
 * If we are going to have a backend, it might make sense just to use youtubei.js on the backend, parse the responses and return formatted data to the frontend.
 *   But that can come later
 */
export async function getInnertube() {
  const innertube = await Innertube.create({
    fetch: fetchHandler
  });
}

async function fetchHandler(request: RequestInfo | URL, init?: RequestInit) {
  console.log(request)
  console.log(init)
  const innertube_path = request.href.replace(/https?:\/\/(www.)?youtube.com\//, '')

  return fetch(PROXY_SERVER_URL + innertube_path, init)
}
