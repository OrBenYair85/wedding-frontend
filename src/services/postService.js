const STORAGE_KEY = 'wedding_posts';

export function getAllPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading from localStorage', err);
    return [];
  }
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
