import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/index';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import WechatCallback from './pages/WechatCallback';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Publish from './pages/Publish';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Support from './pages/Support';

// 受保护的路由组件
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/wechat/callback" element={<WechatCallback />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route 
          path="publish" 
          element={
            <ProtectedRoute>
              <Publish />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="orders" 
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  );
}

export default App;
