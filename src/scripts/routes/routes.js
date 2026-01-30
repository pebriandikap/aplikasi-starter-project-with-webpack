import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import MapPage from '../pages/map/map.js'; 
import LoginPage from '../pages/register/login.js';
import RegisterPage from '../pages/register/register.js';
import addStoryPage from '../pages/add-story.js';


const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/map': MapPage(),
  '/login': LoginPage(),
  '/register': RegisterPage(),
  '/add-story': addStoryPage(),
};

export default routes;
