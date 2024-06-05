import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useNavigate,Link } from 'react-router-dom';

import CardOverflow from '@mui/joy/CardOverflow';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option'
import Typography from '@mui/joy/Typography';
import { Input, Stack,Box, Button } from '@mui/joy';
import axios from 'axios';

interface Supplier {
  id: number;
  SupplierName: string;
  SupplierFirstName: string;
}

export default function NestedCard() {
    const [suppliers,setSuppliers] = React.useState<Supplier[]>([]);
    const [supplier,setSupplier] = React.useState<string>('');
    const [date,setDate] = React.useState<string>('');
    const [timeFrom,setTimeFrom] = React.useState<string>('');
    const [timeTo,setTimeTo] = React.useState<string>('');
    const navigate = useNavigate();

    React.useEffect(() => {
      fetchSuppliers();
    },[]);

    const fetchSuppliers = async () => {
      try {
          const response = await axios.get('/api/supplierData.php');
          setSuppliers(response.data.data);
      } catch (error) {
          console.error('Error fetching suppliers:', error);
      }
  };

    const handleChange = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
      ) => {
        setSupplier(newValue!);
      };


    const isFormValid = () => supplier !== '' && date !== '';  

  return (
    <Card sx={{ borderRadius: 0, width: 1080, maxWidth: '100%' }}>
      <CardContent>
        <Typography level="body-xs">Search</Typography>
        <Typography level="title-lg">For scanning</Typography>
      </CardContent>
      
      <Card
        orientation="horizontal"
        size="sm"
        sx={{ bgcolor: 'background.surface', borderRadius: 0, mb: 1 }}
      >
        <CardContent>
            <Stack direction="row" spacing={10}
            sx={{ width: '100%',display:'flex' }}
            >
            <Box>
            <Typography level="title-md">Supplier Name</Typography>
            <Select onChange={handleChange} sx={{minWidth:'400px'}}>
            <Option value="">All</Option>
           {suppliers.map((supplier) => (
            <Option key={supplier.id} value={supplier.SupplierFirstName}>{supplier.SupplierName}</Option>
           ))}
           
            
            </Select>
            </Box>
          <Box>
          <Typography level="title-md">Date</Typography>
          <Input type='date' sx={{minWidth:'400px'}} value={date} onChange={(e)=>{setDate(e.target.value)}} required/>

          </Box>
            </Stack>
        </CardContent>
      </Card>
      <Card
        orientation="horizontal"
        size="sm"
        sx={{ bgcolor: 'background.surface', borderRadius: 0, mb: 1 }}
      >
        <CardContent>
        <Stack direction="row" spacing={10}
            sx={{ width: '100%',display:'flex' }}
            >
            <Box>
            <Typography level="title-md">Time (From)</Typography>
          <Input type='time' sx={{minWidth:'400px'}} value={timeFrom} onChange={(e)=>(setTimeFrom(e.target.value))}/>
            </Box>
          <Box>
          <Typography level="title-md">Time (To)</Typography>
          <Input type='time' sx={{minWidth:'400px'}} value={timeTo} onChange={(e)=>(setTimeTo(e.target.value))}/>

          </Box>
            </Stack>
        </CardContent>
      </Card>
      <CardOverflow
        variant="soft"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'space-around',
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          paddingX: 20,
          
        }}
      >

       
          <Button sx={{
            borderRadius: 999,
          }} component={Link} to='/scanning' state={{
            supplier: supplier,
            date: date,
            eta_from: timeFrom,
            eta_to: timeTo
          }}
          disabled={!isFormValid()}
          >Next</Button>
       
      </CardOverflow>
    </Card>
  );
}
