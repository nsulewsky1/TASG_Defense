#!/usr/bin/env python3
"""Local preview with Cloudflare-like extensionless HTML routes."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path != "/" and not Path(path.lstrip("/")).suffix:
            candidate = ROOT / f"{path.lstrip('/')}.html"
            if candidate.is_file():
                self.path = f"/{candidate.name}"
        return super().do_GET()

if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8080), Handler).serve_forever()
