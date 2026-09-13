import { build } from 'esbuild';
import { readdir } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { spawnSync } from 'node:child_process';

const files = (await readdir('tests')).filter((name) => /\.test\.tsx?$/.test(name)).sort();
const outdir = resolve('node_modules/.tmp/tests');
await build({
  entryPoints: files.map((name) => `tests/${name}`),
  outdir,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
  logLevel: 'error',
});
const result = spawnSync(process.execPath, ['--test', ...files.map((file) =>
  resolve(outdir, basename(file).replace(/\.tsx?$/, '.mjs')),
)], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
