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
import CompleteReceive from './routes/CompleteReceive.tsx';
import Transaction from './routes/Transaction.tsx';
import Dashboard from './routes/Dashboard.tsx';
import ScanItem from './components/ScanItem.tsx';
import ScanQty from './components/ScanQty.tsx';
import All from './routes/All.tsx';
import Pending from './routes/Pending.tsx';
import Supplier from './routes/Supplier.tsx';
import Scanner from './routes/Scanner.tsx';
import Scan from './routes/Scan.tsx';
import Login from './routes/Login.tsx';
import StartScan from './routes/StartScan.tsx';
import Invoice from './routes/Invoice.tsx';
import InvoiceComplete from './routes/InvoiceComplete.tsx';
import Protected from "./components/Protected";
import Register from "./routes/Register";
import FileUpload from "./components/FileUpload";
import Admin from "./routes/Admin";
import UpdateUser from './routes/UpdateUser'
import ModifyOrder from './routes/ModifyOrder'
import AddOrder from './routes/AddOrder'
import ViewLog from './routes/ViewLog'
import ModifyInv from './routes/ModifyInv'

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Root container element not found");
}

const router = createBrowserRouter([
  {
    path: "/receiving",
    element: <Protected Component={App}/>,
  },
  {
    path: "/receiveinfo",
    element: <Protected Component={Confirmation}/>,
  },
  {
    path:"/selection",
    element: <Protected Component={Selection}/>,
  },
  {
    path:"/complete",
    element: <Protected Component={CompleteReceive}/>,
  },
  {
    path:'/transaction',
    element: <Protected Component={Transaction}/>
  },
  {
    path:'/dashboard',
    element: <Protected Component={Dashboard}/>
  },
  {
    path:'/scan',
    element: <Protected Component={ScanItem}/>
  },
  {
    path:'/scanqty',
    element: <Protected Component={ScanQty}/>
  },
  {
    path:'/alldelivery',
    element: <Protected Component={All}/>
  },
  {
    path:'/pending',
    element: <Protected Component={Pending}/>
  },
  {
    path:'/supplier',
    element: <Protected Component={Supplier}/>
  },
  {
    path:'/scanner',
    element: <Protected Component={Scanner}/>
  },
  {
    path:'/scanning',
    element: <Protected Component={Scan}/>
  },
  {
    path:'/scaninfo',
    element: <Protected Component={StartScan}/>
  },
  {
    path:'/',
    element: <Login/>
  },
  {
    path:'/scan_pending',
    element: <Protected Component={Invoice}/>
  },
  {
    path:'/scan_complete',
    element: <Protected Component={InvoiceComplete}/>
  },
  {
    path:'/register',
    element: <Register/>
  },
  {
    path:'/upload',
    element: <FileUpload/>
  },
  {
    path:'/admin',
    element: <Protected Component={Admin}/>
  },
  {
    path:'/update_user',
    element: <Protected Component={UpdateUser}/>
  },
  {
    path:'/modify_order',
    element: <Protected Component={ModifyOrder}/>
  },{
    path:'/add_order',
    element: <Protected Component={AddOrder}/>
  },{
    path:'/log',
    element: <Protected Component={ViewLog}/>
  },{
    path:'/modify_inv',
    element: <Protected Component={ModifyInv}/>
  }
]);


ReactDOM.createRoot(rootContainer).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
