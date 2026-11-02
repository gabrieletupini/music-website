// Parses a single-part HTTP Range header against a file of `size` bytes.
// Returns { start, end } (inclusive), 'unsatisfiable', or null when the
// header is absent or not something we serve partially (whole file instead).
export function parseRange(header, size) {
    const match = /^bytes=(\d*)-(\d*)$/.exec((header || '').trim());
    if (!match || (match[1] === '' && match[2] === '')) {
        return null;
    }

    let start;
    let end;
    if (match[1] === '') {
        start = Math.max(size - Number(match[2]), 0);
        end = size - 1;
    } else {
        start = Number(match[1]);
        end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
    }

    if (start >= size || start > end) {
        return 'unsatisfiable';
    }
    return { start, end };
}
