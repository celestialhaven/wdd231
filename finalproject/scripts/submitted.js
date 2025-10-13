(function () {
  const TEMP_KEY = 'lastContactSubmission';
  const record = JSON.parse(localStorage.getItem(TEMP_KEY) || '{}');

  if (record.fullName) {
    document.getElementById('submissionDetails').innerHTML = `
      <p><strong>Name:</strong> ${record.fullName}</p>
      <p><strong>Email:</strong> ${record.email}</p>
      <p><strong>Service:</strong> ${record.service}</p>
      <p><strong>Message:</strong> ${record.message}</p>
      <p><strong>Submitted At:</strong> ${new Date(record.submittedAt).toLocaleString()}</p>
    `;
  } else {
    document.getElementById('submissionDetails').innerHTML = `<p>No submission data found.</p>`;
  }
})();