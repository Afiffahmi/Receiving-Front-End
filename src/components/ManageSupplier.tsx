import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useNavigate,Link } from 'react-router-dom';

import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { Input, Stack,Box, Button } from '@mui/joy';
import axios from 'axios';
import {
  Table,
  Sheet
} from '@mui/joy';

interface Supplier {
  SupplierID: number;
  SupplierName: string;
  SupplierFirstName: string;
}


interface Supplier {
  id: number;
  SupplierName: string;
  SupplierFirstName: string;
}


export default function NestedCard() {
    const [supplier,setSupplier] = React.useState<Supplier[]>([]);
    const [supplierName, setSupplierName] = React.useState('');
    const [supplierFirstName, setSupplierFirstName] = React.useState('');
    const [timeTo,setTimeTo] = React.useState<string>('');
    const [stripe, setStripe] = React.useState('odd');
    const navigate = useNavigate();

    React.useEffect(() => {
      fetchSuppliers();
    });

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      try {
          const response = await axios.post('/api/supplier.php', {
              supplierName,
              supplierFirstName,
          });

          if (response.data.message) {
              alert(response.data.message);
              setSupplierName('');
              setSupplierFirstName('');
 
          } else {
              alert(response.data.error);
          }
      } catch (error) {
          alert('An error occurred while creating the supplier.');
          console.error(error);
      }
  };

  const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/supplierData.php');
        setSupplier(response.data.data);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
};


  return (
    <Sheet>
    <Card sx={{ borderRadius: 10,alignContent:'center',alignSelf:'center',display:'flex' }}>
      <form onSubmit={handleSubmit}>
      <CardContent>

        <Typography level="title-lg" sx={{mb:2}}>Add Supplier</Typography>
      </CardContent>
     
        <Stack direction="row" spacing={10}
            sx={{ width: '100%',display:'flex', }}
            >
            <Box>
            <Typography level="title-md">Supplier Name</Typography>
          <Input type='text' sx={{minWidth:'400px'}} value={supplierName} onChange={(e)=>(setSupplierName(e.target.value))}/>
            </Box>
          <Box>
          <Typography level="title-md">Search Name</Typography>
          <Input type='text' sx={{minWidth:'400px'}} value={supplierFirstName} onChange={(e)=>(setSupplierFirstName(e.target.value))}/>

          </Box>
          <Box>
          <Typography level="title-md">`</Typography>
          <Button sx={{
            width: '100px',
            height: '40px',
            borderRadius: 10,
            backgroundColor: 'primary',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary',
              opacity: 0.8,
            
          }}}
          type="submit"
          >Add</Button></Box>
            </Stack>

      <CardOverflow
        variant="plain"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'space-around',
          mt:2,
          borderColor: 'divider',
          paddingX: 20,
          
        }}
      >

       
          
       
      </CardOverflow></form>
      <Sheet
        className="OrderTableContainer"

        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          maxHeight: 360,
          maxWidth: "100%",
        }}
      >
    <Table aria-label="striped table" stripe={stripe} >
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Supplier Name</th>
            <th>Searchable</th>
            <th>Action</th>

          </tr>
        </thead>
        <tbody>
          {supplier.map((row) => (
            <tr key={row.id}>
              <td>{row.SupplierName}</td>
              <td>{row.SupplierFirstName}</td>
              <td><Button size='sm' color='danger' variant='plain'
              onClick={()=>{
                const response = axios.delete('/api/supplier.php', {
                  data: { id: row.id },
                } )

                alert('Supplier Removed');
              }}sx={{mr:1}}
              >Remove</Button>
              <Button size='sm' color='primary' variant='plain'
             
              >Update</Button>
              </td>

            </tr>
          ))}
        </tbody>
      </Table></Sheet>
    </Card>
   </Sheet>
  );
}
