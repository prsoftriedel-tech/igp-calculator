(() => {
  const emit = (event, details = {}) => {
    window.dataLayer?.push({ event, ...details });
    window.dispatchEvent(new CustomEvent('igp:conversion', { detail: { event, ...details } }));
  };

  const form = document.querySelector('#strategy-form');
  const result = document.querySelector('#strategy-result');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const laps = Number(data.get('laps'));
    const fuel = Number(data.get('fuel'));
    const wear = Number(data.get('wear'));
    const reserve = Number(data.get('reserve'));
    const cars = Number(data.get('cars'));
    const weather = String(data.get('weather'));
    if (![laps, fuel, wear, reserve].every(Number.isFinite) || laps < 3 || fuel <= 0 || wear <= 0 || reserve < 0) return;

    const maxSafeLaps = Math.max(1, Math.floor(60 / wear));
    const stints = Math.max(1, Math.ceil(laps / maxSafeLaps));
    const stops = Math.max(0, stints - 1);
    const base = Math.floor(laps / stints);
    const remainder = laps % stints;
    const stintLaps = Array.from({ length: stints }, (_, index) => base + (index < remainder ? 1 : 0));
    const longest = Math.max(...stintLaps);
    const estimatedTyre = Math.max(0, 100 - longest * wear);
    const totalFuel = Math.ceil(laps * fuel + reserve);
    const weatherCopy = weather === 'changeable'
      ? 'Prepare a dry and a wet transition window.'
      : weather === 'wet'
        ? 'Re-check wear and fuel with your proven wet-tyre data.'
        : 'Use your proven dry compound and keep a weather fallback ready.';

    result.innerHTML = `
      <div class="samplehead"><strong>Preview result</strong><span class="pill">FREE</span></div>
      <div class="bigstat">${totalFuel} <small>litres</small></div>
      <p class="statlabel">Estimated race fuel including ${reserve.toFixed(1)} L reserve</p>
      <div class="metricrow">
        <div><strong>${stints} stint${stints === 1 ? '' : 's'}</strong><span>${stops} planned stop${stops === 1 ? '' : 's'}</span></div>
        <div><strong>${estimatedTyre.toFixed(0)}%</strong><span>estimated minimum tyre life</span></div>
      </div>
      <p><strong>Stint structure:</strong> ${stintLaps.join(' + ')} laps</p>
      <p>${weatherCopy}</p>
      ${cars === 2 ? '<p class="gold-line">Two-car note: stagger alternative pit windows to reduce double-stacking risk.</p>' : ''}
      <div class="premium-lock"><strong>Unlock the complete plan</strong><span>Compounds, per-stop fuel, push adaptation and alternative weather windows.</span><a class="btn" href="/rechner/?page=pro">Open Strategy Plus →</a></div>
    `;
    emit('igp27_strategy_preview', { weather, cars, stints });
  });

  const betaForm = document.querySelector('#beta-form');
  const status = document.querySelector('#beta-status');
  betaForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = betaForm.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(betaForm));
    if (data.consent !== 'on') return;
    button.disabled = true;
    status.textContent = 'Submitting…';
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          platform: data.platform,
          raceMode: data.raceMode,
          cars: Number(data.cars),
          locale: data.locale,
          consent: true,
          source: 'igp27-landing'
        })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Submission failed');
      status.textContent = body.updated ? 'Your beta preferences have been updated.' : 'You are on the beta list. Thank you!';
      status.classList.add('success');
      betaForm.reset();
      emit('igp27_waitlist_success', { platform: data.platform, raceMode: data.raceMode });
    } catch {
      status.innerHTML = 'The beta service is not available yet. Please email <a href="mailto:prsoft@me.com?subject=iGP%2027%20Beta">prsoft@me.com</a> and we will add you manually.';
      status.classList.remove('success');
      emit('igp27_waitlist_error');
    } finally {
      button.disabled = false;
    }
  });
  emit('igp27_landing_view');
})();
