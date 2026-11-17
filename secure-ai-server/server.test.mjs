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
    assert.deepEqual(await r.json(), { ok: true, configured: false, accessProtected: true, providerMode: 'default' });
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


test('compatible provider receives a safe educational prompt and returns its answer', async () => {
  const token = 't'.repeat(40);
  let captured;
  const fakeClient = {
    chat: { completions: { create: async payload => {
      captured = payload;
      return { choices: [{ message: { content: 'سلام! پاسخ مرحله‌به‌مرحله.' } }] };
    } } }
  };
  await withServer({ client: fakeClient, accessToken: token, model: 'test-model' }, async base => {
    const r = await fetch(base + '/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'کسر چیست؟' })
    });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { answer: 'سلام! پاسخ مرحله‌به‌مرحله.' });
    assert.equal(captured.model, 'test-model');
    assert.equal(captured.messages[1].content, 'کسر چیست؟');
    assert.match(captured.messages[0].content, /معلم هوشمند فارسی/);
  });
});

test('tutor endpoint validates question type and size', async () => {
  const token = 't'.repeat(40);
  const fakeClient = { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'ok' } }] }) } } };
  await withServer({ client: fakeClient, accessToken: token }, async base => {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const empty = await fetch(base + '/api/tutor', { method: 'POST', headers, body: JSON.stringify({ question: '  ' }) });
    assert.equal(empty.status, 400);
    const long = await fetch(base + '/api/tutor', { method: 'POST', headers, body: JSON.stringify({ question: 'x'.repeat(2501) }) });
    assert.equal(long.status, 413);
  });
});
