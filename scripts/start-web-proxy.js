const { spawn } = require('node:child_process');
const http = require('node:http');
const https = require('node:https');
const { URL } = require('node:url');

const proxyPort = Number(process.env.WEB_PROXY_PORT ?? 8083);
const expoPort = Number(process.env.EXPO_DEV_SERVER_PORT ?? 8084);
const apiTarget = process.env.VIDEO_API_PROXY_TARGET;
const expoTarget = `http://localhost:${expoPort}`;
const expoStartArgs = process.argv.slice(2);

const normalizeTarget = (value, name) => {
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  try {
    return new URL(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
};

const apiTargetUrl = normalizeTarget(apiTarget, 'VIDEO_API_PROXY_TARGET');
const expoTargetUrl = normalizeTarget(expoTarget, 'EXPO_DEV_SERVER_PORT');

const shouldProxyToApi = (pathname) => {
  return pathname === '/api' || pathname.startsWith('/api/') || pathname === '/videos' || pathname.startsWith('/videos/');
};

const joinTargetPath = (basePath, requestPath) => {
  const normalizedBasePath = basePath.replace(/\/$/, '') || '/';

  if (normalizedBasePath === '/') {
    return requestPath;
  }

  if (requestPath === normalizedBasePath || requestPath.startsWith(`${normalizedBasePath}/`)) {
    return requestPath;
  }

  return `${normalizedBasePath}${requestPath}`;
};

const createTargetUrl = (requestUrl, target) => {
  const targetUrl = new URL(target.toString());
  targetUrl.pathname = joinTargetPath(targetUrl.pathname, requestUrl.pathname);
  targetUrl.search = requestUrl.search;
  return targetUrl;
};

const writeJsonError = (res, statusCode, message) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ message }));
};

const proxyRequest = (req, res, target) => {
  const requestUrl = new URL(req.url ?? '/', `http://localhost:${proxyPort}`);
  const targetUrl = createTargetUrl(requestUrl, target);
  const transport = targetUrl.protocol === 'https:' ? https : http;

  const proxyReq = transport.request(
    targetUrl,
    {
      method: req.method,
      headers: {
        ...req.headers,
        host: targetUrl.host,
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', (error) => {
    writeJsonError(res, 502, `本地代理请求失败：${error.message}`);
  });

  req.pipe(proxyReq);
};

const expo = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['expo', 'start', ...expoStartArgs, '--port', String(expoPort)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      EXPO_PUBLIC_VIDEO_API_BASE_URL: process.env.EXPO_PUBLIC_VIDEO_API_BASE_URL ?? '/api',
    },
  },
);

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url ?? '/', `http://localhost:${proxyPort}`).pathname;
  const target = shouldProxyToApi(pathname) ? apiTargetUrl : expoTargetUrl;

  proxyRequest(req, res, target);
});

server.on('error', (error) => {
  console.error(error);
  expo.kill('SIGTERM');
  process.exit(1);
});

server.listen(proxyPort, () => {
  console.log(`Web proxy ready: http://localhost:${proxyPort}`);
  console.log(`API proxy target: ${apiTargetUrl.origin}`);
  console.log(`Expo dev server: ${expoTarget}`);
});

const shutdown = () => {
  server.close();
  expo.kill('SIGTERM');
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

expo.on('exit', (code, signal) => {
  server.close(() => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
});
