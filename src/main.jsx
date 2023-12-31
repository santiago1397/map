import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
  HashRouter,
  BrowserRouter, 
  Route, 
  Routes 
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <App />
    ),
  },
  {
    path: "/:key",
    element: (
      <App />
    ),
  },

], );

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />

)

