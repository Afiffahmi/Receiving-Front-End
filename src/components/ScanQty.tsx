import React, { useState, useRef, useEffect } from 'react';
import {useNavigate,Link, Navigate,useLocation} from 'react-router-dom';
import Barcode from 'react-barcode';
// For web compatibility, consider using a library like react-zxing or user-media API

const Scanner = () => {
  const [scannedData, setScannedData] = useState(0);
  const [text, setText] = useState('');

  const textInputRef2 = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state;console.log()

  const handleChange = (input:any) => {
    let qty = Number(input.target.value);
    if(item.itemNo === item.scan && qty <= item.total){
      qty += Number(item.prev_qty)
    }else{
      qty += item.prev_qty
    }
    window.setTimeout(() => {
    navigate('/receiveinfo',{state: {...item,qty:qty},replace:true})
  },2000)
  }

    
  
    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    };
  

  return (
    <div className="scanner-container">
      {scannedData && <p>Last Scanned Data: {scannedData}</p>}

      <div>
      <input 
        type="text" 
        value={text} 
        onChange={handleChanges} 
        placeholder="Enter text to generate barcode" 
      />
      <div>
        <Barcode value={text} />
      </div>
    </div>
      <input
        type="text"
        onChange={(e)=>{handleChange(e)}}
        autoFocus={!scannedData}
        
      />
    </div>
  );
};

export default Scanner;
