const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist', 'azure-test-ui', 'browser');

app.use(express.static(distPath));

app.get('/api/hello', (_req, res) => {
  res.json({
    message: 'Hello from your container app!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Azure test UI running on port ${port}`);
});
