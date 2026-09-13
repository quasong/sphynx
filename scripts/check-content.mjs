// Runs the library's content checks outside the browser, so that a dangling
// citation fails the build rather than printing to a console nobody is
// watching. The content modules are plain data and import nothing from React,
// which is what lets them be bundled for Node as they are.
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const outfile = resolve('node_modules/.tmp/check-content.mjs');
await mkdir(dirname(outfile), { recursive: true });

await build({
  entryPoints: ['scripts/content-presentation.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
  outfile,
  logLevel: 'error',
});

const { entries, findContentProblems, findPresentationProblems } = await import(pathToFileURL(outfile).href);
const problems = [...findContentProblems(), ...findPresentationProblems()];

if (problems.length > 0) {
  console.error(`[sphynx] ${problems.length} content problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

const proved = entries.filter((entry) => entry.timeline).length;
console.log(`[sphynx] ${entries.length} entries, ${proved} with timelines, no content problems.`);
