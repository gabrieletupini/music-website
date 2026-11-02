// Run with: node --test tests/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRange } from '../lib/range.mjs';

const SIZE = 1000;

test('no Range header means the whole file', () => {
    assert.equal(parseRange(null, SIZE), null);
});

test('closed range', () => {
    assert.deepEqual(parseRange('bytes=100-199', SIZE), { start: 100, end: 199 });
});

test('open-ended range runs to the last byte', () => {
    assert.deepEqual(parseRange('bytes=500-', SIZE), { start: 500, end: 999 });
});

test('suffix range takes the last N bytes', () => {
    assert.deepEqual(parseRange('bytes=-100', SIZE), { start: 900, end: 999 });
});

test('end past the file is clamped to the last byte', () => {
    assert.deepEqual(parseRange('bytes=900-5000', SIZE), { start: 900, end: 999 });
});

test('start past the file is unsatisfiable', () => {
    assert.equal(parseRange('bytes=1000-', SIZE), 'unsatisfiable');
});

test('start after end is unsatisfiable', () => {
    assert.equal(parseRange('bytes=300-200', SIZE), 'unsatisfiable');
});

test('malformed or multi-part ranges fall back to the whole file', () => {
    assert.equal(parseRange('bytes=abc', SIZE), null);
    assert.equal(parseRange('bytes=0-10,20-30', SIZE), null);
    assert.equal(parseRange('items=0-10', SIZE), null);
});
