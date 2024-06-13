/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack'

import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Stepper from '@mui/joy/Stepper';

import axios from 'axios';
import {useLocation} from 'react-router-dom';


import {Link as RouterLink } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent'
import {useNavigate} from 'react-router-dom';

export interface Root {
  data: Daum[]
}

export interface Daum {
  receiveID: number
  RefNo: string
  PartNo: string
  Qty: number
  Supplier: string
  ETA: string
  Description: string
  WsCd: string
  Loc: string
  JOCPlanLot: string
  PONo: string
  Date: string;
  consume_data: ConsumeDaum[]
}

export interface ConsumeDaum {
  rcv_qty: number
  rcv_date: string
  rcv_time: string
}

interface Supplier {
  id: number;
  SupplierName: string;
  SupplierFirstName: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<Daum[]>([]);
  const [etaTo, setEtaTo] = React.useState("");
  const [refno, setRefNo] = React.useState("");
  const [pono, setPONo] = React.useState("");
  const [qty, setQty] = React.useState(0);
  const [receiveID , setReceiveID] = React.useState(0);
  const [partNo, setPartNo] = React.useState("");
  const [supplier, setSupplier] = React.useState("");
  const [ETA, setETA] = React.useState("");
  const [Date, setDate] = React.useState("");
  const location = useLocation();
  const [suppliers,setSuppliers] = React.useState<Supplier[]>([]);
  const item = location.state;
  let totalqty;
  const authorize = localStorage.getItem("token");
  const navigate = useNavigate();
  //@ts-ignore
  const id = JSON.parse(authorize);

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/scanComplete.php');
      setRows(response.data.data);

      console.log(response.data);
      
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchSuppliers();
  fetchData();
});

React.useEffect(() => {
  //@ts-ignore
  if(id.type !== '3'){
    alert('youre not suppose to be here!!')
    navigate('/dashboard')
  }
},[])

const fetchSuppliers = async () => {
  try {
      const response = await axios.get('/api/supplierData.php');
      setSuppliers(response.data.data);
  } catch (error) {
      console.error('Error fetching suppliers:', error);
  }
};

const fetchData = async (input: string) => {
  try {
    const response = await axios.get("/api/scanComplete.php", {
      params: {
        ...item,
        part_no: input,
        supplier: supplier,
        date: Date,
        eta_from: ETA,
      },
    });

    setRows(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};

const fetchSupplier = async (
  event: React.SyntheticEvent | null,
  newValue: string | null
) => {
  setSupplier(newValue!);
  try {
    const response = await axios.get("/api/scanComplete.php", {
      params: {
        ...item,
        supplier: newValue,
        date: Date,
        eta_from: ETA,
        eta_to: etaTo,
      },
    });

    setRows(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};

const fetchDate = async (input: string) => {
  setDate(input);

  try {
    const response = await axios.get("/api/scanComplete.php", {
      params: {
        ...item,
        date: input,
        supplier: supplier,
        eta_from: ETA,
        eta_to: etaTo,
      },
    });

    setRows(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};

const fetchEtaTo = async (input: string) => {
  setEtaTo(input);
  console.log({
    ...item,
    date: input,
    supplier: supplier,
    eta_from: ETA,
    eta_to: input,
  });
  try {
    const response = await axios.get("/api/scanComplete.php", {
      params: {
        ...item,
        date: Date,
        supplier: supplier,
        eta_from: ETA,
        eta_to: input,
      },
    });

    setRows(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};

const fetchEta = async (input: string) => {
  setETA(input);
  try {
    const response = await axios.get("/api/scanComplete.php", {
      params: {
        ...item,
        date: Date,
        supplier: supplier,
        eta_from: input,
        eta_to: etaTo,
      },
    });

    setRows(response.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};

const handleDelete = () => {
  const response = axios.delete(`/api/order.php`,{
    data: {
      receiveID: receiveID,
      staffName: id.username
    },
  
  });
  response.then((res) => {
    console.log(res.data);
    if (res.data.message) {
      alert(res.data.message);
    } else {
      alert(res.data.error);
    }
  });
}

  const renderFilters = () => (
    <React.Fragment>
    
    <FormControl size="sm">
      <FormLabel>Date</FormLabel>
      <Input type="date" onChange={(e) => fetchDate(e.target.value)} />
    </FormControl>
    <FormControl size="sm">
      <FormLabel>Supplier</FormLabel>
      <Select
        onChange={fetchSupplier}
        size="sm"
        placeholder="Filter by supplier"
        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
      >
         <Option value="">All</Option>
          {suppliers.map((supplier) => (
            <Option key={supplier.id} value={supplier.SupplierFirstName}>{supplier.SupplierName}</Option>
           ))}
      </Select>
    </FormControl>
    {/* <FormControl size="sm">
      <FormLabel>ETA(from)</FormLabel>
      <Input type="time" onChange={(e) => fetchEta(e.target.value)} />
    </FormControl>
    <FormControl size="sm">
      <FormLabel>ETA(to)</FormLabel>
      <Input type="time" onChange={(e) => fetchEtaTo(e.target.value)} />
    </FormControl> */}
    
    <FormControl sx={{ flex: 1 }} size="sm">
        <FormLabel>Search for invoice</FormLabel>
        <Input
          size="sm"
          placeholder="Search by Part Number"
          startDecorator={<SearchIcon />}
          onChange={(e) => {
            fetchData(e.target.value);
          }}
        />
      </FormControl>
  </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            maxWidth: { xs: '120px', md: '800px' },
          },
        }}
      >
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
          maxWidth: '100%',
        }}
      >
        <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Update invoices detail</DialogTitle>
          <DialogContent>Fill in the information of the invoice.</DialogContent>
          <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={async(event: any) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  

                  if (refno !== "" && pono !== "") {
                    const url = "/api/order.php";

                    const data = {
                     RefNo : refno,
                      PONo : pono,
                      Qty : qty,
                      receiveID : receiveID,
                      staffName: id.username
                      
                    };

                    const headers = {
                      "Content-Type": "application/json",
                      "Accept": "application/json",
                    };
                    
              
                    const response = await axios.put(url, JSON.stringify(data), {
                      headers: headers,
                    });
                    
                    console.log(response.data);
                    
                  if(response.data.message){
                    alert(response.data.message);
                  }else{
                    alert(response.data.error);
                  }
                  }
                  setOpen(false);
                }}
              >
                <FormControl required>
                  <FormLabel>Ref No</FormLabel>
                  <Input type="text"  value={refno} onChange={(e)=>{setRefNo(e.target.value)}} required/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Po Number</FormLabel>
                  <Input type="text" value={pono} onChange={(e)=>setPONo(e.target.value)} required/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Quantity</FormLabel>
                  <Input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} required/>
                </FormControl>

                
               
                
                <Stack gap={1} sx={{ mt: 2 }}>
                 
                  <Button type="submit" fullWidth>
                    Update
                  </Button>
                  <Button color='danger' fullWidth onClick={handleDelete}>
                    Delete order
                  </Button>
                </Stack>
              </form>
            </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <th>
          <Typography level='title-sm'>Ref No</Typography>
          </th>
          <th>
          <Typography level='title-sm'>Part No</Typography>
          </th>
          <th>
          <Typography level='title-sm'>Description</Typography>
          </th>
<th>
<Typography level='title-sm'>Supplier</Typography>
</th>
<th>
<Typography level='title-sm'>PO No</Typography>
</th>
<th>
<Typography level='title-sm'>Qty</Typography>
</th>

<th>
<Typography level='title-sm'>Date</Typography>
</th>
<th>
<Typography level='title-sm'>Plan Lot</Typography>
</th>
<th>
<Typography level='title-sm'>Status</Typography>
</th>
<th>
<Typography level='title-sm'>Actions</Typography>
</th>
          <tbody>
            {stableSort(rows, getComparator(order, 'RefNo')).map((row) => (
              <tr key={row.RefNo}>
               
                
            
                
                <td>
                  
                  <Typography level="body-xs">{row.RefNo}</Typography>
                </td>
                <td>
                
                    <Typography level="body-xs">{row.PartNo}</Typography>
                </td>
                <td style={{width:200}}>
                
                  <Typography level="body-xs">{row.Description}</Typography>
                </td>
                <td style={{width:180}}>
                
                  <Typography level="body-xs">{row.Supplier}</Typography>
                </td>

                <td>
                
                  <Typography level="body-xs">{row.PONo}</Typography>
                </td>

                <td style={{width:100}}>
                
                
                <Typography level="body-xs">{row.Qty}</Typography>
             
                  </td>
                 
                

                <td>
               
                  <Typography level="body-xs">{row.Date}</Typography>
                </td>
                <td>
               
                  <Typography level="body-xs">{row.JOCPlanLot}</Typography>
                </td>
                <td style={{ textAlign: 'center', width: 120 }}>
                 {row.Qty <= 0 ? <Chip color='success'>Complete</Chip> : <Chip color='success'>Complete</Chip>}
                </td>
                <td>
                  <Button onClick={()=>{setOpen(true);
                  setRefNo(row.RefNo);
                  setPONo(row.PONo);
                  setQty(row.Qty);
                  setReceiveID(row.receiveID);
                  }}>
                    Modify
                  </Button>


                </td>
              
             
             
              
              </tr>
            ))}
            </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
          maxWidth: '50%',
        }}
      >
        <Button
          component={RouterLink}
          to = '/admin'
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

       

       
      </Box>
    </React.Fragment>
  );
}

