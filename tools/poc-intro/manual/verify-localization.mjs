process.argv[2] ||= 'D:/codex-work/manual-localization-20261020';
process.argv.push('--localized');
await import('./verify-controls.mjs');
