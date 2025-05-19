// src/scripts/data/idb-service.js
import { openDB } from 'idb';

const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

// Membuka / membuat database IndexedDB
const openDatabase = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const store = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        console.log(`[IndexedDB] Object store "${OBJECT_STORE_NAME}" dibuat.`);
      }
    }
  });
};

// Simpan satu cerita
export const saveStoryToDB = async (story) => {
  if (!story || !story.id) {
    throw new Error('Cerita tidak memiliki ID.');
  }
  const db = await openDatabase();
  await db.put(OBJECT_STORE_NAME, story);
  console.log(`[IndexedDB] Cerita "${story.id}" disimpan.`);
};

// Ambil semua cerita
export const getAllStoriesFromDB = async () => {
  const db = await openDatabase();
  const stories = await db.getAll(OBJECT_STORE_NAME);
  console.log(`[IndexedDB] Mengambil ${stories.length} cerita.`);
  return stories;
};

// Ambil satu cerita
export const getStoryByIdFromDB = async (id) => {
  const db = await openDatabase();
  const story = await db.get(OBJECT_STORE_NAME, id);
  console.log(`[IndexedDB] Cerita ID "${id}" ditemukan:`, !!story);
  return story;
};

// Hapus satu cerita
export const deleteStoryFromDB = async (id) => {
  const db = await openDatabase();
  await db.delete(OBJECT_STORE_NAME, id);
  console.log(`[IndexedDB] Cerita ID "${id}" dihapus.`);
};
