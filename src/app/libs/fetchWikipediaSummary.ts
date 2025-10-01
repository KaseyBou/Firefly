export async function fetchWikipediaSummary(url: string) {
  if (!url) return '';
  try {
    const title = url.split('/').pop();
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data.extract || '';
  } catch {
    return '';
  }
}
