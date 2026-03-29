import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import SchoolRegister from './pages/SchoolRegister';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/school-register',
    element: <SchoolRegister />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/task/:id',
    element: <TaskDetail />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

export default router;