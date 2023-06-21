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

], { basename: "https://santiago1397.github.io/map/" });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/map/" element={<App />} />
        <Route path="/map/:key" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)

