import { openDB } from 'idb';

const dbPromise = openDB('cerita-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('stories')) {
      db.createObjectStore('stories', { keyPath: 'id' });
    }
  }
});

export async function saveStory(story) {
  const db = await dbPromise;
  await db.put('stories', story);
}

export async function getAllStories() {
  const db = await dbPromise;
  return db.getAll('stories');
}

export async function deleteStory(id) {
  const db = await dbPromise;
  await db.delete('stories', id);
}
