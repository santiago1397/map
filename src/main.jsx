import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:key" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

