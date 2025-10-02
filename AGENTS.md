```bash

# Dev Server Loggin

tail -100 logs/dev-server.log  #View last 100 lines of dev server log (recommended)

cat logs/dev-server.log #View entire dev server log

./scripts/rotate-dev-logs/sh #manually rotate logs (archives old, cleans up 7+ days)

#Browser Console Integration

# Next.js shows browser console logs in the dev server output (browserDebugInfoInTerminal experiment)

# This includes console.log, console.error, and other browser debugging output

# Check logs/dev-server.log fro both server-side and client-side debugging information

# Note: This feature helps with faster debugging since all logs are consolidated in one place