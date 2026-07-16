import './App.css'
import "./theme.css";

import { Routes, Route } from "react-router-dom";
import { VideoPage } from './components/video_components/VideoPage';
import { VideoGrid } from './components/video_components/VideoGrid';
import { AboutUsPage } from './components/AboutUsPage';
import { NavBar } from './components/NavBar';
import { AppRoutes } from './routes';
import { useEffect, useReducer } from 'react';
import {reducer, initialState} from './state/creatorVideoState';
import { loadState, saveState } from './storage/storage';
import { PlaylistsPage } from './components/playlist_components/PlaylistsPage';

export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadState() ?? initialState
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <div>
      <NavBar></NavBar>

      <Routes>
        <Route path={AppRoutes.HOME} element={<VideoGrid state={state} dispatch={dispatch} />} />
        <Route path={AppRoutes.VIDEO} element={<VideoPage />} />
        <Route path={AppRoutes.ABOUT} element={<AboutUsPage />} />
        <Route path={AppRoutes.PLAYLISTS} element={<PlaylistsPage state={state} dispatch={dispatch} />} />
      </Routes>
    </div>
  );
}