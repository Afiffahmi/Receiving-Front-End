import React, { useState, useRef, useEffect } from 'react';
import {useNavigate,Link, Navigate,useLocation} from 'react-router-dom';
import Barcode from 'react-barcode';
import { Box, Grid, Sheet, Typography } from '@mui/joy';
import Input from '@mui/joy/Input';
// For web compatibility, consider using a library like react-zxing or user-media API

const Scanner = () => {
  const [scannedData, setScannedData] = useState(0);
  const [text, setText] = useState('');

  const textInputRef2 = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state;
  console.log(item);

  const handleChange = (input:any) => {
    let qty = Number(input.target.value);
    if(item.itemNo === item.scan && (qty + item.prev_qty) <= item.total){
      qty += Number(item.prev_qty)
    }else{
      qty = item.prev_qty
    }
    window.setTimeout(() => {
    navigate('/receiveinfo',{state: {...item,qty:qty},replace:true})
  },2000)
  }

    
  
    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    };
  

  return (
    <Sheet
        sx={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "100vw",
          top: "50%",
          height: "100vh", // Set height for full viewport coverage
          position: "relative", // Required for background image positioning
        }}
      >
      <Box sx={{alignSelf:'center',alignItems:'center',justifyContent:'center',width:550}}>
      {text ? <Barcode value={text}/> : <Barcode value={item.total} />}
      
      <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Reference Number
              </Typography>
              {item.RefNo.map((ref:any,index:number) => (
                <Typography key={index} fontWeight="lg">{ref}</Typography>
              ))}
             
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Item Number
              </Typography>
              <Typography fontWeight="lg">{item.itemNo}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Total Quantity
              </Typography>
              <Typography fontWeight="lg">{item.total}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Current Quantity
              </Typography>
              <Typography fontWeight="lg">{item.prev_qty}</Typography>
            </div>
          </Sheet>
      <Typography level="h3">Scan Quantity</Typography>
      <Typography level="body-md">Scan the item quantity</Typography>
      <Input 
        type="text" 
        value={text} 
        onChange={handleChanges} 
        placeholder="Enter text to generate quantity barcode..." 
        sx={{marginBottom: 2}}
      />
      
      <Input
        type="text"
        onChange={(e)=>{handleChange(e)}}
        autoFocus={!scannedData}
        placeholder='Scan quantity here...'
      /></Box>
    </Sheet>
  );
};

export default Scanner;
