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

const router = createHashRouter([
    {
      path: "/map/",
      element: (
        <App/>
      ),
      children: [
        {
          path: "/map/:key",
          element: <App/>,
        },
      ],
    },
 
  ],{ basename: import.meta.env.DEV ? '/' : '/map/' });

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
