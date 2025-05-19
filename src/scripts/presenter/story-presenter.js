import { getStories, postStory } from '../data/api.js';

export function fetchStories(callbacks) {
  if (typeof callbacks?.onLoading === 'function') callbacks.onLoading();

  getStories()
    .then((stories) => {
      if (typeof callbacks?.onSuccess === 'function') callbacks.onSuccess(stories);
    })
    .catch((error) => {
      console.error('Gagal mengambil data cerita:', error);
      if (typeof callbacks?.onError === 'function') callbacks.onError(error);
    });
}

export function submitStory({ description, photo, lat, lon }) {
  return postStory({ description, photo, lat, lon });
}
