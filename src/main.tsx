import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Confirmation from './routes/Confirmation.tsx';
import Selection from './routes/Selection.tsx';
import FileUpload from './components/FileUpload.tsx';
import CompleteReceive from './routes/CompleteReceive.tsx';
import Transaction from './routes/Transaction.tsx';
import Dashboard from './routes/Dashboard.tsx';
import ScanItem from './components/ScanItem.tsx';
import ScanQty from './components/ScanQty.tsx';
import All from './routes/All.tsx';
import Pending from './routes/Pending.tsx';

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Root container element not found");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <FileUpload />,
  },
  {
    path: "/receiving",
    element: <App />,
  },
  {
    path: "/receiveinfo",
    element: <Confirmation />,
  },
  {
    path:"/selection",
    element: <Selection />,
  },
  {
    path:"/complete",
    element: <CompleteReceive />,
  },
  {
    path:'/transaction',
    element: <Transaction/>
  },
  {
    path:'/dashboard',
    element: <Dashboard/>
  },
  {
    path:'/scan',
    element: <ScanItem />
  },
  {
    path:'/scanqty',
    element: <ScanQty/>
  },
  {
    path:'/alldelivery',
    element: <All />
  },
  {
    path:'/pending',
    element: <Pending />
  }
]);


ReactDOM.createRoot(rootContainer).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
