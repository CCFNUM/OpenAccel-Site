const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const REPO = 'CCFNUM/OpenAccel';

// In-flight request deduplication: map endpoint → pending promise
const inflight = new Map<string, Promise<any>>();

/** SSR guard — localStorage and fetch are only available in the browser */
const isBrowser = typeof window !== 'undefined';

async function fetchGitHub(endpoint: string): Promise<any | null> {
  if (!isBrowser) return null;

  const cacheKey = `gh_${endpoint}`;

  // Return from cache if fresh
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed.data;
      }
    }
  } catch {
    // corrupt cache entry — ignore
  }

  // Deduplicate concurrent calls for the same endpoint
  if (inflight.has(endpoint)) {
    return inflight.get(endpoint);
  }

  const promise = (async () => {
    try {
      const res = await fetch(`https://api.github.com/${endpoint}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!res.ok) {
        if (res.status === 403) {
          console.warn('GitHub API rate limited. Data will not be shown.');
        }
        return null;
      }

      const data = await res.json();
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
      } catch {
        // localStorage full or unavailable — degrade silently
      }
      return data;
    } catch (e) {
      console.error('Failed to fetch from GitHub API:', e);
      return null;
    } finally {
      inflight.delete(endpoint);
    }
  })();

  inflight.set(endpoint, promise);
  return promise;
}

export async function getRepoStats() {
  const [repo, release, commits] = await Promise.all([
    fetchGitHub(`repos/${REPO}`),
    fetchGitHub(`repos/${REPO}/releases/latest`),
    fetchGitHub(`repos/${REPO}/commits?per_page=1`),
  ]);
  if (!repo) return null;
  return {
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    openIssues: repo.open_issues_count ?? 0,
    latestRelease: release?.tag_name || 'v0.2.0',
    lastCommit: commits?.[0]?.commit?.author?.date ?? null,
  };
}

export async function getContributors() {
  const data = await fetchGitHub(`repos/${REPO}/contributors?per_page=100`);
  if (!data || !Array.isArray(data)) return null;
  return data.map((c: any) => ({
    login: c.login,
    avatarUrl: c.avatar_url,
    profileUrl: c.html_url,
    contributions: c.contributions,
  }));
}

export async function getOpenIssues(label?: string) {
  const labelQuery = label ? `&labels=${encodeURIComponent(label)}` : '';
  const data = await fetchGitHub(`repos/${REPO}/issues?state=open${labelQuery}`);
  return Array.isArray(data) ? data : null;
}

/**
 * GitHub Discussions are only available via GraphQL, not the REST API.
 * Without a server-side token (which we don't expose to the client), we can't
 * fetch live discussion threads. Returns null, which the Community page handles
 * by showing the category cards with links instead.
 *
 * To surface live threads: set up an API route that proxies the GraphQL call
 * using a read-only GITHUB_TOKEN secret stored server-side.
 */
export async function getRecentDiscussions() {
  return null;
}
