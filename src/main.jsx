import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Posts, ProfileVideos, AddToPlaylist } from "./components/index.js";
import {
  VideoPage,
  Home,
  Signup,
  Login,
  UserProfile,
  ChannelProfile,
  UploadVideo,
  Library,
  History,
  PlaylistVideos,
  AllPlaylists,
  AllLikedVideos
} from "./pages/index.js";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/userProfile",
        element: <UserProfile />,
        children: [
          {
            index: true,
            element: <ProfileVideos />,
          },
          {
            path: "videos",
            element: <ProfileVideos />,
          },
          {
            path: `posts`,
            element: <Posts />,
          },
        ],
      },
      {
        path: `/:user`,
        element: <ChannelProfile/>,
        children : [
          {
            index: true,
            element: <ProfileVideos/>
          },
          {
            path: "videos",
            element: <ProfileVideos/>
          },
          {
            path: "posts",
            element: <Posts/>
          }
        ]
      },
      {
        path: "/video/:videoId",
        element: <VideoPage />,
        children: [
          {
            path: "addToPlaylist",
            element: <AddToPlaylist />,
          },
        ],
      },
      {
        path: "/library",
        element: <Library/>
      },
      {
        path: "/history",
        element: <History/>
      },
      {
        path: "/playlist/:playlistId",
        element: <PlaylistVideos/>
      },
      {
        path: "/allPlaylists",
        element: <AllPlaylists/>,
      },
      {
        path: "/allLikedVideos",
        element: <AllLikedVideos/>
      }
    ],
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/upload-video",
    element: <UploadVideo />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </StrictMode>
);
