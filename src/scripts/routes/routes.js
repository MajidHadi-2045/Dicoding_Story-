import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page.js';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/story/:id': new StoryDetailPage(),
};

export default routes;
