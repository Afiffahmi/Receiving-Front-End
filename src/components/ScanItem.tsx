import React, { useState, useRef, useEffect } from 'react';
import {useNavigate,Link, Navigate,useLocation} from 'react-router-dom';
// For web compatibility, consider using a library like react-zxing or user-media API

const Scanner = () => {
  const [scannedData, setScannedData] = useState('');

  const textInputRef2 = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state;

  
  const handleChange = (input:any) => {
    setScannedData(input.target.value);
    window.setTimeout(() => {

        navigate('/scanqty',{state: {...item,scan:input.target.value},replace:true})
        },2000)


  }

  return (
    <div className="scanner-container">
      {scannedData && <p>Last Scanned Data: {scannedData}</p>}

      <input
        type="text"
        onChange={(e)=>{handleChange(e)}}
        autoFocus={!scannedData}
        
      />
    </div>
  );
};

export default Scanner;
