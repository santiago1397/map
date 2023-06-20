import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
      path: "/map/",
      element: (
        <App/>
      ),
    },
    {
      path: "/map/:key",
      element: (
        <App/>
      ),
    },
 
  ], {basename: "https://santiago1397.github.io/map/"});

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
