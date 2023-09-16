import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from './App'
import './index.css'
import Task5Component from "./components/Task5Component";
import WeatherAppComponent from "./components/WeatherAppComponent.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "third",
        element: <WeatherAppComponent/>,
    },
    {
        path: "fifth",
        element: <Task5Component/>,
    },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <div className='app'>
          <div className='main-container'>
              <RouterProvider router={router} />
          </div>
      </div>
  </React.StrictMode>,
)
