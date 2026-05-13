import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';

export function loadLocalEnv() {
  for (const fileName of ['.env.local', '.env']) {
    const filePath = path.join(process.cwd(), fileName);

    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const [key, ...valueParts] = trimmed.split('=');

      if (!key || process.env[key]) {
        continue;
      }

      process.env[key] = valueParts.join('=').replace(/^['"]|['"]$/g, '');
    }
  }
}
