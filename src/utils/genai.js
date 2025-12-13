export async function callGenAI(input, opts = {}) {
  // input can be a string prompt, or a File (or Blob). opts can include { prompt }
  let res;

  if (typeof input === 'string') {
    const prompt = input.trim();
    if (!prompt) throw new Error('prompt must be a non-empty string');
    res = await fetch('/api/genai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
  } else if (input instanceof File || input instanceof Blob) {
    // send multipart/form-data with file and optional prompt
    const form = new FormData();
    form.append('file', input);
    if (opts.prompt && typeof opts.prompt === 'string') form.append('prompt', opts.prompt);

    res = await fetch('/api/genai', {
      method: 'POST',
      body: form,
    });
  } else if (input && input.file) {
    // accept object like { file, prompt }
    const { file, prompt } = input;
    if (!(file instanceof File || file instanceof Blob)) throw new Error('file must be a File or Blob');
    const form = new FormData();
    form.append('file', file);
    if (prompt && typeof prompt === 'string') form.append('prompt', prompt);

    res = await fetch('/api/genai', {
      method: 'POST',
      body: form,
    });
  } else {
    throw new Error('callGenAI expects a prompt string or a File');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'GenAI proxy error');
  }
  const data = await res.json();
  return data.text;
}
