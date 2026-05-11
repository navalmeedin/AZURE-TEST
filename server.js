const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist', 'azure-test-ui', 'browser');

app.use(express.static(distPath));

app.get('/api/container-proxy', async (req, res) => {
  const rawUrl = req.query.url;

  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    res.status(400).json({
      error: 'Missing url query parameter.'
    });
    return;
  }

  let targetUrl;

  try {
    targetUrl = new URL(rawUrl);
  } catch {
    res.status(400).json({
      error: 'Invalid URL format.'
    });
    return;
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    res.status(400).json({
      error: 'Only http and https URLs are supported.'
    });
    return;
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json, text/plain;q=0.9, text/html;q=0.8, */*;q=0.7'
      }
    });
    const responseBody = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') ?? 'text/plain; charset=utf-8';

    res.status(upstreamResponse.status);
    res.setHeader('content-type', contentType);
    res.setHeader('x-proxy-target', targetUrl.toString());
    res.send(responseBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown proxy failure.';

    res.status(502).json({
      error: 'Failed to reach the Container App from the Web App server.',
      detail: message,
      targetUrl: targetUrl.toString()
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Azure test UI running on port ${port}`);
});
