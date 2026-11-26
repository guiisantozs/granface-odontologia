param(
    [ValidateRange(0, 65535)][int]$Port = 0,
    [switch]$NoBrowser
)
$ErrorActionPreference = 'Stop'
$siteRoot = Join-Path $PSScriptRoot 'site'
if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'index.html'))) {
    throw 'Extraia o ZIP completo antes de abrir a apresentacao.'
}

# Loopback-only static file preview. No installation, persistence or external access.
Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public sealed class GranfacePortablePreview
{
    private readonly string root;
    private readonly TcpListener listener;
    public string Url { get; private set; }

    public GranfacePortablePreview(string directory, int port)
    {
        root = Path.GetFullPath(directory).TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
        listener = new TcpListener(IPAddress.Loopback, port);
        listener.Start();
        Url = "http://127.0.0.1:" + ((IPEndPoint)listener.LocalEndpoint).Port + "/";
    }

    public void Run()
    {
        while (true)
        {
            TcpClient client = listener.AcceptTcpClient();
            ThreadPool.QueueUserWorkItem(delegate(object state) { Serve((TcpClient)state); }, client);
        }
    }

    public void Stop() { listener.Stop(); }

    private static void Header(Stream output, string status, string type, long length)
    {
        string value = "HTTP/1.1 " + status + "\r\nContent-Type: " + type +
            "\r\nContent-Length: " + length +
            "\r\nConnection: close\r\nCache-Control: no-cache\r\nX-Content-Type-Options: nosniff\r\n\r\n";
        byte[] bytes = Encoding.ASCII.GetBytes(value);
        output.Write(bytes, 0, bytes.Length);
    }

    private static string Mime(string filename)
    {
        switch (Path.GetExtension(filename).ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".js": case ".mjs": return "text/javascript; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".json": return "application/json; charset=utf-8";
            case ".svg": return "image/svg+xml";
            case ".png": return "image/png";
            case ".jpg": case ".jpeg": case ".jfif": return "image/jpeg";
            case ".webp": return "image/webp";
            case ".ico": return "image/x-icon";
            case ".woff2": return "font/woff2";
            case ".woff": return "font/woff";
            default: return "application/octet-stream";
        }
    }

    private void Serve(TcpClient client)
    {
        using (client)
        {
            try
            {
                client.ReceiveTimeout = 5000;
                client.SendTimeout = 15000;
                using (NetworkStream stream = client.GetStream())
                using (StreamReader reader = new StreamReader(stream, Encoding.ASCII, false, 4096, true))
                {
                    string request = reader.ReadLine();
                    if (request == null || request.Length > 8192) return;
                    string[] parts = request.Split(' ');
                    if (parts.Length != 3) { Header(stream, "400 Bad Request", "text/plain", 0); return; }
                    string method = parts[0];
                    if (method != "GET" && method != "HEAD") { Header(stream, "405 Method Not Allowed", "text/plain", 0); return; }
                    int total = 0;
                    string line;
                    do {
                        line = reader.ReadLine();
                        total += line == null ? 0 : line.Length;
                        if (total > 32768) { Header(stream, "431 Request Header Fields Too Large", "text/plain", 0); return; }
                    } while (!String.IsNullOrEmpty(line));
                    string urlPath = parts[1].Split('?')[0];
                    if (!urlPath.StartsWith("/", StringComparison.Ordinal)) { Header(stream, "400 Bad Request", "text/plain", 0); return; }
                    string relative = Uri.UnescapeDataString(urlPath).TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                    string filename = Path.GetFullPath(Path.Combine(root, relative));
                    if (Directory.Exists(filename)) filename = Path.Combine(filename, "index.html");
                    if (!filename.StartsWith(root, StringComparison.OrdinalIgnoreCase)) { Header(stream, "403 Forbidden", "text/plain", 0); return; }
                    if (!File.Exists(filename)) { Header(stream, "404 Not Found", "text/plain", 0); return; }
                    using (FileStream file = File.OpenRead(filename))
                    {
                        Header(stream, "200 OK", Mime(filename), file.Length);
                        if (method == "GET") file.CopyTo(stream);
                    }
                }
            }
            catch (IOException) { }
            catch (SocketException) { }
            catch (ArgumentException) { }
            catch (UnauthorizedAccessException) { }
        }
    }
}
'@

$preview = New-Object GranfacePortablePreview($siteRoot, $Port)
Write-Host ''
Write-Host ' GRANFACE ODONTOLOGIA - APRESENTACAO LOCAL' -ForegroundColor Yellow
Write-Host ''
Write-Host (' Abra no navegador: ' + $preview.Url)
Write-Host ' Mantenha esta janela aberta durante a apresentacao.'
Write-Host ' Para encerrar, feche esta janela.'
Write-Host ''
try {
    if (-not $NoBrowser) { Start-Process -FilePath $preview.Url }
    $preview.Run()
} finally {
    $preview.Stop()
}
