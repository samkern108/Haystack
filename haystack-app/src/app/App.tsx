import "../pages/styles/root.css";
import "../pages/styles/colors.css";

import { useState, useEffect, useReducer } from 'react';
import { Routes, Route } from "react-router-dom";

import { VideoPage } from '../pages/VideoPage';
import { SubmitACreatorPage } from '../pages/SubmitACreatorPage'
import { HomePage } from '../pages/HomePage';
import { AboutUsPage } from '../pages/AboutUsPage';
import { PlaylistsPage } from '../pages/PlaylistsPage';
import { NavBar } from '../features/nav/NavBar';
import { AppRoutes } from '../features/nav/routes';
import {reducer, initialState} from '../state/state';
import { loadState, saveState } from '../storage/storage';
import { SearchPage } from "../pages/SearchPage";
import { UserProfilePage } from "../pages/UserProfilePage";
import { InnertubeContext } from "../contexts/InnertubeContext";
import { getInnertube, getDummyInnertube } from "../services/innertube.js";
import { CreatorsPage } from "../pages/CreatorsPage.js";

export default function App() {
  const [innertube, setInnertube] = useState(getDummyInnertube());

  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadState() ?? initialState
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const initInnertube = async () => {
      const innertube = await getInnertube();

      setInnertube(innertube);
    };

    initInnertube();
  }, []);

  return (
    <div>
      <InnertubeContext value={innertube}>
        <NavBar></NavBar>
        <Routes>
          <Route path={AppRoutes.HOME} element={<HomePage state={state} dispatch={dispatch} />} />
          <Route path={AppRoutes.CREATORS} element={<CreatorsPage state={state} dispatch={dispatch} />} />
          <Route path={AppRoutes.VIDEO} element={<VideoPage state={state} dispatch={dispatch} />} />
          <Route path={AppRoutes.ABOUT} element={<AboutUsPage />} />
          <Route path={AppRoutes.PLAYLISTS} element={<PlaylistsPage state={state} dispatch={dispatch} />} />
          <Route path={AppRoutes.SUBMIT_A_CREATOR} element={<SubmitACreatorPage />} />
          <Route path={AppRoutes.SEARCH} element={<SearchPage/>} />
          <Route path={AppRoutes.USER_PROFILE} element={<UserProfilePage/>} />
        </Routes>
      </InnertubeContext>
    </div>
  );
}
