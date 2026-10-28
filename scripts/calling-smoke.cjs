// Real browser + local backend smoke test. Payments/push/STT are simulated
// by the separate backend harness; Agora SDK/media is not mocked here.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function json(url, options) {
  const response = await fetch(`http://127.0.0.1:5101${url}`, options);
  const data = await response.json();
  if (!response.ok) throw Error(`${url}: ${response.status} ${data.message}`);
  return data;
}
async function main() {
  console.log('SMOKE_BROWSER_START');
  const fixtures = await json('/__smoke/fixtures');
  console.log('TEST_FIXTURES_LOADED');
  const browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  try {
    console.log('CHROME_STARTED');
    const context = await browser.newContext({ permissions: ['camera', 'microphone'], locale: 'en-US' });
    await context.addCookies([{ name: 'accessToken', value: fixtures.consultantToken, url: 'http://localhost:3000' }, { name: 'NEXT_LOCALE', value: 'en', url: 'http://localhost:3000' }]);
    const page = await context.newPage();
    const apiErrors = [];
    const mediaLogs = [];
    let incomingSocketReady = false;
    page.on('pageerror', error => console.log('BROWSER_ERROR', error.message));
    page.on('console', message => {
      const text = message.text();
      if (text.includes('Consultant Socket connected')) incomingSocketReady = true;
      if (/connection.*(CONNECTED|FAILED)|remote user|user-published|AGORA SUBSCRIBED|join.*success|Agora.*error/i.test(text)) {
        mediaLogs.push(text.replace(/token=[^&\s']+/g, 'token=REDACTED').slice(0, 400));
      }
    });
    page.on('response', response => { if (response.url().startsWith('http://localhost:5101/') && response.status() >= 400) apiErrors.push({ path: new URL(response.url()).pathname, status: response.status() }); });
    await page.goto('http://localhost:3000/en/consultant/overview', { timeout: 120000, waitUntil: 'domcontentloaded' });
    console.log('DASHBOARD_LOADED');
    for (let attempt = 0; attempt < 60 && !incomingSocketReady; attempt++) await sleep(1000);
    assert.ok(incomingSocketReady, 'Incoming-call socket must connect before signaling');
    await json('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fixtures.consultantEmail, password: 'SmokePassword123!' }) });
    console.log('INCOMING_SOCKET_READY');
    let state;
    for (let attempt = 0; attempt < 600; attempt++) {
      state = await json('/__smoke/state');
      if (state.sessions.some(session => session.status === 'pending')) break;
      await sleep(1000);
    }
    assert.ok(state.sessions.length, 'Android app must create the call');
    const session = state.sessions.find(session => session.status === 'pending');
    assert.ok(session, 'Android app must create a pending call');
    assert.equal(session.status, 'pending');
    assert.equal(state.ledger.filter(x => x.consultationId === session.consultation && x.type === 'charge').length, 0, 'No billing before acceptance');
    console.log('CALLER_PENDING_NO_CHARGE');
    await json('/api/v1/video-session/create', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${fixtures.normalUserToken}` }, body: JSON.stringify({ consultationId: session.consultation }) });
    await page.getByRole('button', { name: 'Accept Call', exact: true }).evaluate(button => button.click(), { timeout: 30000 });
    await page.waitForURL(/\/call\?/, { timeout: 60000 });
    console.log('INCOMING_CALL_ACCEPTED_IN_BROWSER');
    await sleep(20000);
    state = await json('/__smoke/state');
    const active = state.sessions.find(x => x._id === session._id);
    assert.equal(active.status, 'ongoing');
    assert.equal(active.joinedParticipants.length, 2);
    assert.equal(state.ledger.filter(x => x.consultationId === session.consultation && x.type === 'charge' && x.billingMinute === 1 && x.status === 'succeeded').length, 1);
    console.log('BOTH_JOINED_ONE_INITIAL_CHARGE');
    console.log('MEDIA_LOGS', JSON.stringify(mediaLogs));
    assert.ok(mediaLogs.some(log => /AGORA SUBSCRIBED.*\[audio\]/.test(log)), 'Browser must subscribe to Android audio');
    assert.ok(mediaLogs.some(log => /AGORA SUBSCRIBED.*\[video\]/.test(log)), 'Browser must subscribe to Android video');
    console.log('API_ERRORS', JSON.stringify(apiErrors));
    // End through the real page's red call control.
    const endControl = page.locator('button.bg-red-600');
    if (await endControl.count() === 1) {
      await endControl.evaluate(button => button.click());
      await sleep(3000);
      state = await json('/__smoke/state');
      assert.equal(state.sessions.find(x => x._id === session._id).status, 'ended');
      console.log('BROWSER_HANGUP_ENDED_BACKEND');
    } else console.log('HANGUP_CONTROL_NOT_IDENTIFIED');
    console.log('SMOKE_BROWSER_FINISHED');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
