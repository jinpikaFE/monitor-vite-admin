import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from '../config/routes'

import '@antd/dist/reset.css'
import Loading from './components/loading'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} fallbackElement={<Loading />} />
  // </React.StrictMode>
)
