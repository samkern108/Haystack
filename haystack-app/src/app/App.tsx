import "../pages/styles/root.css";
import "../pages/styles/colors.css";

import { useEffect, useReducer } from 'react';
import { Routes, Route } from "react-router-dom";

import { VideoPage } from '../pages/VideoPage';
import { SubmitACreatorPage } from '../pages/SubmitACreatorPage'
import { HomePage } from '../pages/HomePage';
import { AboutUsPage } from '../pages/AboutUsPage';
import { PlaylistsPage } from '../pages/PlaylistsPage';
import { NavBar } from '../features/nav/NavBar';
import { AppRoutes } from './routes';
import {reducer, initialState} from '../state/state';
import { loadState, saveState } from '../storage/storage';

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
        <Route path={AppRoutes.HOME} element={<HomePage state={state} dispatch={dispatch} />} />
        <Route path={AppRoutes.VIDEO} element={<VideoPage />} />
        <Route path={AppRoutes.ABOUT} element={<AboutUsPage />} />
        <Route path={AppRoutes.PLAYLISTS} element={<PlaylistsPage state={state} dispatch={dispatch} />} />
        <Route path={AppRoutes.SUBMIT_A_CREATOR} element={<SubmitACreatorPage state={state} dispatch={dispatch} />} />
      </Routes>
    </div>
  );
}