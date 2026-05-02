/**
 * Build-time GitHub metadata fetchers.
 *
 * Public-repo data only. Unauthenticated requests are rate-limited to
 * 60/hour per IP; set GITHUB_TOKEN in .env (or the CI environment) to
 * raise that to 5000/hour.
 *
 * Results are cached to `node_modules/.cache/slatewave-github/` with a
 * 30-minute TTL so dev hot-reloads don't burn API quota.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'slatewave-github');
const TTL_MS = 30 * 60 * 1000;

export interface RepoMeta {
  stars: number;
  pushedAt: string;
  defaultBranch: string;
  openIssues: number;
  latestRelease: Release | null;
}

export interface Release {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease: boolean;
}

const memory = new Map<string, Promise<unknown>>();

function cacheKey(parts: string[]): string {
  return parts.join('__').replace(/[^a-zA-Z0-9_-]/g, '_');
}

async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await readFile(join(CACHE_DIR, `${key}.json`), 'utf8');
    const parsed = JSON.parse(raw) as { data: T; at: number };
    if (Date.now() - parsed.at < TTL_MS) return parsed.data;
  } catch {
    /* no cache yet */
  }
  return null;
}

/**
 * Read the cache regardless of TTL. Used as a fallback when GitHub
 * rate-limits us — stale data is better than null on a build that
 * would otherwise blank the activity panel.
 */
async function readStaleCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await readFile(join(CACHE_DIR, `${key}.json`), 'utf8');
    const parsed = JSON.parse(raw) as { data: T; at: number };
    return parsed.data;
  } catch {
    return null;
  }
}

function isRateLimited(res: Response): boolean {
  if (res.status === 429) return true;
  if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') return true;
  return false;
}

async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(
      join(CACHE_DIR, `${key}.json`),
      JSON.stringify({ data, at: Date.now() }),
      'utf8',
    );
  } catch {
    /* cache write failures should never break the build */
  }
}

function headers(): HeadersInit {
  const base: Record<string, string> = {
    'User-Agent': 'slatewave-web',
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) base.Authorization = `Bearer ${token}`;
  return base;
}

function toRelease(raw: Record<string, unknown>): Release {
  return {
    tag: String(raw.tag_name ?? ''),
    name: String(raw.name ?? raw.tag_name ?? ''),
    publishedAt: String(raw.published_at ?? raw.created_at ?? ''),
    url: String(raw.html_url ?? ''),
    body: String(raw.body ?? ''),
    isPrerelease: Boolean(raw.prerelease),
  };
}

export async function fetchRepoMeta(
  owner: string,
  name: string,
): Promise<RepoMeta | null> {
  const key = cacheKey([owner, name, 'meta']);
  const existing = memory.get(key) as Promise<RepoMeta | null> | undefined;
  if (existing) return existing;

  const task = (async (): Promise<RepoMeta | null> => {
    const cached = await readCache<RepoMeta>(key);
    if (cached) return cached;

    try {
      const [repoRes, releaseRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${name}`, { headers: headers() }),
        fetch(`https://api.github.com/repos/${owner}/${name}/releases/latest`, {
          headers: headers(),
        }),
      ]);

      if (!repoRes.ok) {
        if (isRateLimited(repoRes)) {
          console.warn(
            `[github] rate-limited on ${owner}/${name} — falling back to stale cache. ` +
              'Set GITHUB_TOKEN to raise the limit to 5000/hour.',
          );
          return await readStaleCache<RepoMeta>(key);
        }
        console.warn(`[github] repo ${owner}/${name}: ${repoRes.status} ${repoRes.statusText}`);
        return null;
      }

      const repo = (await repoRes.json()) as Record<string, unknown>;
      const release =
        releaseRes.ok ? ((await releaseRes.json()) as Record<string, unknown>) : null;

      const meta: RepoMeta = {
        stars: Number(repo.stargazers_count ?? 0),
        pushedAt: String(repo.pushed_at ?? ''),
        defaultBranch: String(repo.default_branch ?? 'main'),
        openIssues: Number(repo.open_issues_count ?? 0),
        latestRelease: release ? toRelease(release) : null,
      };

      await writeCache(key, meta);
      return meta;
    } catch (err) {
      console.warn(`[github] repo ${owner}/${name}: ${(err as Error).message}`);
      return null;
    }
  })();

  memory.set(key, task);
  return task;
}

export async function fetchReleases(
  owner: string,
  name: string,
  limit = 10,
): Promise<Release[]> {
  const key = cacheKey([owner, name, 'releases', String(limit)]);
  const existing = memory.get(key) as Promise<Release[]> | undefined;
  if (existing) return existing;

  const task = (async (): Promise<Release[]> => {
    const cached = await readCache<Release[]>(key);
    if (cached) return cached;

    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${name}/releases?per_page=${limit}`,
        { headers: headers() },
      );
      if (!res.ok) {
        if (isRateLimited(res)) {
          console.warn(
            `[github] rate-limited on ${owner}/${name} releases — falling back to stale cache. ` +
              'Set GITHUB_TOKEN to raise the limit to 5000/hour.',
          );
          return (await readStaleCache<Release[]>(key)) ?? [];
        }
        console.warn(
          `[github] releases ${owner}/${name}: ${res.status} ${res.statusText}`,
        );
        return [];
      }
      const raw = (await res.json()) as Record<string, unknown>[];
      const releases = raw.map(toRelease);
      await writeCache(key, releases);
      return releases;
    } catch (err) {
      console.warn(`[github] releases ${owner}/${name}: ${(err as Error).message}`);
      return [];
    }
  })();

  memory.set(key, task);
  return task;
}
