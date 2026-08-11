import http from "http";

const PORT = 3000;
const LARAVEL_URL = "http://localhost:8000";

const server = http.createServer((req, res) => {
    const target = LARAVEL_URL + req.url;
    http.get(target, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
    }).on("error", () => {
        res.writeHead(502);
        res.end("Bad Gateway - Laravel backend not running on port 8000");
    });
});

server.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
