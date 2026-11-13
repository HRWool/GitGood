// HTTP layer for Git Good: serves the static site and a small JSON API backed by Prisma.
// createServer() takes the PrismaClient so tests can pass a client for the test database.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const students = require("./students");

const ROOT = path.join(__dirname, "..");
const MAX_BODY_BYTES = 10 * 1024;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
// Server code, database files and dependencies are never served to the browser.
const PRIVATE_DIRS = new Set(["server", "prisma", "tests", "node_modules"]);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new HttpError(413, "Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {});
      } catch {
        reject(new HttpError(400, "Request body must be valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

// Prisma connection failures (server down, wrong password, missing database) become a 503.
function isDatabaseUnavailable(err) {
  if (!err) return false;
  if (err.name === "PrismaClientInitializationError") return true;
  return ["P1000", "P1001", "P1002", "P1003", "P1017"].includes(err.code);
}

function sendError(res, err) {
  if (err instanceof students.ValidationError || err instanceof students.ConflictError) {
    sendJson(res, err.status, { error: err.message, errors: err.errors });
  } else if (err instanceof students.NotFoundError || err instanceof students.AuthenticationError || err instanceof HttpError) {
    sendJson(res, err.status, { error: err.message });
  } else if (isDatabaseUnavailable(err)) {
    sendJson(res, 503, { error: "The database is not reachable right now. Check that PostgreSQL is running and try again." });
  } else {
    console.error(err);
    sendJson(res, 500, { error: "Something went wrong on the server." });
  }
}

async function handleApi(prisma, req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent); // ["api", ...]
  const method = req.method;

  if (parts[1] === "health" && parts.length === 2 && method === "GET") {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return sendJson(res, 200, { ok: true, database: true });
    } catch {
      return sendJson(res, 200, { ok: true, database: false });
    }
  }

  if (parts[1] === "auth" && parts[2] === "login" && parts.length === 3 && method === "POST") {
    const body = await readJson(req);
    return sendJson(res, 200, { student: await students.authenticateStudent(prisma, body) });
  }

  if (parts[1] !== "students") throw new HttpError(404, "Unknown API route.");

  if (parts.length === 2 && method === "POST") {
    const body = await readJson(req);
    return sendJson(res, 201, { student: await students.createStudent(prisma, body) });
  }
  if (parts.length === 3 && method === "GET") {
    return sendJson(res, 200, { student: await students.getStudent(prisma, parts[2]) });
  }
  if (parts.length === 4 && parts[3] === "skills" && method === "PUT") {
    const body = await readJson(req);
    return sendJson(res, 200, { student: await students.setStudentSkills(prisma, parts[2], body.skills) });
  }
  throw new HttpError(405, "That method is not supported for this route.");
}

function serveStatic(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405).end();
    return;
  }
  let rel;
  try {
    rel = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.normalize(path.join(ROOT, rel));
  const segments = path.relative(ROOT, file).split(path.sep);
  const blocked = !file.startsWith(ROOT + path.sep) || PRIVATE_DIRS.has(segments[0]) || segments.some((s) => s.startsWith("."));
  const type = TYPES[path.extname(file).toLowerCase()];
  if (blocked || !type) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": type });
    res.end(req.method === "HEAD" ? undefined : data);
  });
}

function createServer(prisma) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      handleApi(prisma, req, res, url).catch((err) => sendError(res, err));
    } else {
      serveStatic(req, res, url);
    }
  });
}

module.exports = { createServer };
