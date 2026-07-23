/**
 * NFR Gate — password protection for the AI Risk Dashboard.
 * Loaded as a synchronous script before React mounts so the gate
 * appears before any React content is rendered.
 *
 * Flow:
 *   First visit (no auth) → gate overlay → correct password →
 *     sessionStorage.nfr_auth = '1' → redirect to client-story.html
 *
 *   Return visit (auth set) → this script does nothing → React mounts normally
 *   "Enter Dashboard" in client-story.html → ./ → React mounts → /#/measure
 */
(function () {
  if (sessionStorage.getItem('nfr_auth') === '1') return;

  /* ── Build overlay ── */
  var ov = document.createElement('div');
  ov.id = 'nfr-gate';

  var style = document.createElement('style');
  style.textContent = [
    '#nfr-gate{',
      'position:fixed;inset:0;z-index:99999;',
      'background:radial-gradient(130% 140% at 65% -10%,#52088F 0%,#160029 58%);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'padding:24px;font-family:Inter,system-ui,sans-serif;',
    '}',
    '#nfr-gate-card{width:100%;max-width:400px;text-align:center}',
    '#nfr-gate h1{',
      'font-family:"Space Grotesk",sans-serif;font-size:26px;font-weight:700;',
      'color:#fff;margin:16px 0 8px;letter-spacing:-.5px;',
    '}',
    '#nfr-gate .ey{',
      'font-family:"JetBrains Mono",monospace;font-size:10.5px;font-weight:700;',
      'letter-spacing:.18em;text-transform:uppercase;color:#FF50C8;',
    '}',
    '#nfr-gate .sub{font-size:14px;color:rgba(255,255,255,.45);margin-bottom:34px}',
    '#nfr-pw{',
      'width:100%;padding:14px 18px;box-sizing:border-box;',
      'background:rgba(255,255,255,.07);border:1px solid rgba(161,0,255,.38);',
      'border-radius:12px;font-family:"JetBrains Mono",monospace;font-size:15px;',
      'color:#fff;text-align:center;letter-spacing:.1em;outline:none;',
      'transition:border-color .2s,background .2s;',
    '}',
    '#nfr-pw:focus{border-color:#A100FF;background:rgba(161,0,255,.11)}',
    '#nfr-pw::placeholder{font-family:Inter,sans-serif;font-size:13px;letter-spacing:.03em;color:rgba(255,255,255,.28)}',
    '#nfr-err{font-size:12.5px;color:#FF7070;height:20px;margin:8px 0 6px;opacity:0;transition:opacity .2s}',
    '#nfr-btn{',
      'width:100%;padding:14px;border:none;border-radius:12px;cursor:pointer;',
      'background:linear-gradient(135deg,#3D0066,#A100FF);',
      'font-family:"Space Grotesk",sans-serif;font-size:15px;font-weight:600;color:#fff;',
      'transition:filter .15s,transform .12s;',
    '}',
    '#nfr-btn:hover{filter:brightness(1.12);transform:translateY(-1px)}',
    '#nfr-btn:active{transform:translateY(0)}',
    '#nfr-footer{',
      'position:fixed;bottom:18px;left:50%;transform:translateX(-50%);',
      'font-family:"JetBrains Mono",monospace;font-size:10.5px;',
      'color:rgba(255,255,255,.18);white-space:nowrap;',
    '}',
  ].join('');
  document.head.appendChild(style);

  ov.innerHTML = [
    '<div id="nfr-gate-card">',
      /* chevron logo */
      '<svg width="30" height="30" viewBox="0 0 100 100" fill="none">',
        '<path d="M18 10 L58 50 L18 90 L32 90 L72 50 L32 10 Z" fill="url(#gv_gate)"/>',
        '<defs><linearGradient id="gv_gate" x1="18" y1="10" x2="72" y2="90" gradientUnits="userSpaceOnUse">',
          '<stop offset="0%" stop-color="#C77BFF"/><stop offset="100%" stop-color="#FF50C8"/>',
        '</linearGradient></defs>',
      '</svg>',
      '<p class="ey">Accenture NFR Practice</p>',
      '<h1>AI Risk Management</h1>',
      '<p class="sub">Enter your access code to continue</p>',
      '<input id="nfr-pw" type="password" placeholder="Access code" autocomplete="current-password">',
      '<p id="nfr-err">Incorrect access code — please try again.</p>',
      '<button id="nfr-btn">Access Platform</button>',
    '</div>',
    '<div id="nfr-footer">Accenture &middot; NFR AI Assets &middot; AI Risk Management</div>',
  ].join('');

  document.body.appendChild(ov);

  /* ── Interaction ── */
  function attempt() {
    var inp = document.getElementById('nfr-pw');
    if (!inp) return;
    if (inp.value === 'Studio2026') {
      sessionStorage.setItem('nfr_auth', '1');
      /* First-time visitors land on the client story */
      window.location.replace('./client-story.html');
    } else {
      var err = document.getElementById('nfr-err');
      if (err) err.style.opacity = '1';
      inp.style.borderColor = 'rgba(239,68,68,.55)';
      inp.value = '';
      setTimeout(function () { inp.style.borderColor = 'rgba(161,0,255,.38)'; }, 1600);
    }
  }

  document.getElementById('nfr-btn').addEventListener('click', attempt);
  document.getElementById('nfr-pw').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') attempt();
  });
  /* auto-focus after next paint */
  requestAnimationFrame(function () {
    var inp = document.getElementById('nfr-pw');
    if (inp) inp.focus();
  });
}());
