import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.mjs';
async function withServer(config, fn) {
  const app = createApp({ appOrigins: 'https://app.example', ...config });
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const address = server.address();
  try { await fn(`http://127.0.0.1:${address.port}`); }
  finally { await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())); }
}
test('health reports configuration without exposing secrets', async () => {
  await withServer({ apiKey: '', accessToken: 'x'.repeat(40) }, async base => {
    const r = await fetch(base + '/health'); assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { ok: true, configured: false, accessProtected: true });
    assert.equal(r.headers.get('cache-control'), 'no-store');
  });
});
test('tutor endpoint rejects missing bearer token', async () => {
  await withServer({ apiKey: '', accessToken: 'x'.repeat(40) }, async base => {
    const r = await fetch(base + '/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'سلام' }) });
    assert.equal(r.status, 401); assert.equal((await r.json()).error, 'Invalid access token');
  });
});
test('valid token does not bypass missing API configuration', async () => {
  const token = 't'.repeat(40);
  await withServer({ apiKey: '', accessToken: token }, async base => {
    const r = await fetch(base + '/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ question: 'سلام' }) });
    assert.equal(r.status, 503); assert.equal((await r.json()).error, 'AI backend not configured');
  });
});
test('tutor endpoint is disabled without a sufficiently long access token', async () => {
  await withServer({ apiKey: '', accessToken: '' }, async base => {
    const r = await fetch(base + '/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: 'سلام' }) });
    assert.equal(r.status, 503); assert.equal((await r.json()).error, 'Tutor access protection is not configured');
  });
});
