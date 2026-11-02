// Serves /audio/* with HTTP Range support. Pages' static assets ignore Range
// and always return the whole file, so the browser can only seek within what
// it has already downloaded - clicking ahead on the timeline stalls.
import { parseRange } from '../../lib/range.mjs';

export async function onRequestGet({ request, env }) {
    // Fetched without the Range header: the static asset is always whole.
    const asset = await env.ASSETS.fetch(new Request(request.url));
    if (!asset.ok) {
        return asset;
    }

    const body = await asset.arrayBuffer();
    const size = body.byteLength;
    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');

    const range = parseRange(request.headers.get('Range'), size);
    if (range === 'unsatisfiable') {
        headers.set('Content-Range', `bytes */${size}`);
        headers.delete('Content-Length');
        return new Response(null, { status: 416, headers });
    }
    if (range === null) {
        return new Response(body, { status: 200, headers });
    }

    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
    headers.set('Content-Length', String(range.end - range.start + 1));
    return new Response(body.slice(range.start, range.end + 1), { status: 206, headers });
}
