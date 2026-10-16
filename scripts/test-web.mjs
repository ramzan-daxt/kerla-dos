import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// The native wrapper has its own test command; the default suite covers the web app.
const files = readdirSync('tests').filter(name => name.endsWith('.test.mjs') && name !== 'ios-config.test.mjs').sort();
const result = spawnSync(process.execPath, ['--test', ...files.map(name => `tests/${name}`)], { stdio: 'inherit' });
process.exit(result.status ?? 1);
