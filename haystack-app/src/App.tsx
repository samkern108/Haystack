import './App.css'

import { Routes, Route } from "react-router-dom";
import { VideoPage } from './components/VideoPage';
import { VideoGrid } from './components/VideoGrid';
import { AboutUsPage } from './components/AboutUsPage';
import { NavBar } from './components/NavBar';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <div>
      <NavBar></NavBar>

      <Routes>
        <Route path={AppRoutes.HOME} element={<VideoGrid />} />
        <Route path={AppRoutes.VIDEO} element={<VideoPage />} />
        <Route path={AppRoutes.ABOUT} element={<AboutUsPage />} />
      </Routes>
    </div>
  );
}