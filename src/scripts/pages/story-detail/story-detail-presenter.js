import { getStories } from '../../data/api.js';

export default class StoryDetailPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async showDetail(id) {
    try {
      const stories = await getStories();
      const story = stories.find((s) => s.id === id);
      if (story) {
        this.#view.displayStory(story);
      } else {
        this.#view.displayError('Cerita tidak ditemukan.');
      }
    } catch (e) {
      this.#view.displayError('Gagal mengambil data cerita.');
    }
  }
}
