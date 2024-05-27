import React, { useState, useRef, useEffect } from 'react';
import {useNavigate,Link, Navigate,useLocation} from 'react-router-dom';
import Input from '@mui/joy/Input';
import Barcode from 'react-barcode';
import { Box, Sheet, Typography } from '@mui/joy';
import CircularProgress from '@mui/joy/CircularProgress';
// For web compatibility, consider using a library like react-zxing or user-media API

const Scanner = () => {
  const [scannedData, setScannedData] = useState('');
  const [secret,setSecret] = useState('Reveal');

  const textInputRef2 = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const item = location.state;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScannedData(e.target.value);

    if(e.target.value === 'Reveal'){
      setLoading(true);
      setScannedData('');
      window.setTimeout(() => {
      setSecret(item.itemNo);
      
      setLoading(false);
      },1500);
      
    }

    if(e.target.value != 'Reveal' && e.target.value.length >= 7){
      
      handleChange(e.target.value);
    }
  }
  
  const handleChange = (input:any) => {

    window.setTimeout(() => {

        navigate('/scanqty',{state: {...item,scan:input},replace:true})
        },2300)


  }

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
      {loading ? <CircularProgress /> : <Barcode value={secret} />}
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
            
          </Sheet>
      <Typography level="h3">Scan Item</Typography>
      <Typography level="body-md">Scan the item barcode</Typography>
      


      <Input
        type="text"
        onChange={(e)=>{handleInput(e)}}
        value={scannedData}
        autoFocus={!scannedData}
        placeholder="Part Number here..."
      />
      {scannedData && <p>Scanned Data: {scannedData}</p>}
</Box>
    </Sheet>
  );
};

export default Scanner;
