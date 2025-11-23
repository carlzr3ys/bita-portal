# Quick script to kill process on port 3001
# Usage: .\KILL_PORT.ps1

$port = 3001
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $pids) {
        Write-Host "Killing process $pid on port $port..."
        taskkill /PID $pid /F
    }
    Write-Host "✅ Process killed. Port $port is now free."
    Write-Host "Now you can run: npm run server"
} else {
    Write-Host "✅ Port $port is already free."
}

