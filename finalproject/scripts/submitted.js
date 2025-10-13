// submitted.js
document.addEventListener('DOMContentLoaded', () => {
  const statusEl   = document.getElementById('status');
  const serverIdEl = document.getElementById('serverId');
  const payloadEl  = document.getElementById('payload');
  const detailsEl  = document.getElementById('submissionDetails');

  // Read saved submission info
  const data = JSON.parse(localStorage.getItem('lastContactSubmission') || 'null');

  // Fallback message
  if (!data) {
    if (detailsEl) detailsEl.textContent = 'No submission data available.';
    if (statusEl) statusEl.textContent = 'No submission found.';
    if (serverIdEl) serverIdEl.textContent = '—';
    if (payloadEl) payloadEl.textContent = '';
    return;
  }

  // ✅ Keep API summary visible for demo
  if (statusEl)   statusEl.textContent = data.sentToServer ? 'Sent to API ✅' : 'Saved locally (offline) 🗂️';
  if (serverIdEl) serverIdEl.textContent = data.serverResponse?.id ?? '—';
  if (payloadEl)  payloadEl.textContent = '';
});
