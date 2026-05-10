import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(import.meta.url), '..', '..');
const distRoot = join(projectRoot, 'dist');
const port = Number(process.argv[2] ?? 8082);

const routeFiles = new Map([
  ['/', 'index.html'],
  ['/gift', 'gift.html'],
  ['/track', 'track.html'],
  ['/ops', 'ops.html'],
]);

const mimeByExtension = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.ico', 'image/x-icon'],
  ['.json', 'application/json; charset=utf-8'],
]);

function getFilePath(urlPath) {
  const cleanPath = urlPath.endsWith('/') && urlPath !== '/' ? urlPath.slice(0, -1) : urlPath;
  const routeFile = routeFiles.get(cleanPath);

  if (routeFile) {
    return join(distRoot, routeFile);
  }

  const decoded = decodeURIComponent(cleanPath);
  const normalized = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  return join(distRoot, normalized);
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host}`);
    let filePath = getFilePath(requestUrl.pathname);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    const body = await readFile(filePath);
    const mime = mimeByExtension.get(extname(filePath)) ?? 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': mime });
    response.end(body);
  } catch {
    const body = await readFile(join(distRoot, '+not-found.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(body);
  }
});

server.listen(port, () => {
  console.log(`Brota web build listening at http://localhost:${port}`);
});
