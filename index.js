#!/usr/bin/env node
const { exec } = require('child_process')
console.log('[Main] Starting...')
const api = exec('node server/api/index.js')
console.log('[Main] API server started.')
const website = exec('node server/website/index.js')
console.log('[Main] Website server started.')
const proxy = exec('node server/index.js')
console.log('[Main] Started proxy server.')
const bot = exec('node manager.js')
console.log('[Main] Started bot')
api.stdout.on('data',data => process.stdout.write(`[API] ${data.toString()}`))
api.stderr.on('data',data => process.stderr.write(`[API] ${data.toString()}`))
website.stdout.on('data',data => process.stdout.write(`[Website] ${data.toString()}`))
website.stderr.on('data',data => process.stderr.write(`[Website] ${data.toString()}`))
proxy.stdout.on('data',data => process.stdout.write(`[Proxy] ${data.toString()}`))
proxy.stderr.on('data',data => process.stderr.write(`[Proxy] ${data.toString()}`))
bot.stdout.on('data',data => process.stdout.write(`[Bot] ${data.toString()}`))
bot.stderr.on('data',data => process.stderr.write(`[Bot] ${data.toString()}`))
require('fs').writeFileSync('pidfile',process.pid.toString())
process.on('SIGTERM',() => {
  console.log('[Main] SIGTERM')
  console.log('[Main] Killing child')
  bot.kill('SIGTERM')
  api.kill('SIGTERM')
  website.kill('SIGTERM')
  proxy.kill('SIGTERM')
  process.exit(0)
})