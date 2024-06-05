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
import ButtonGroup from '@mui/joy';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {Link as RouterLink } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/joy';

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
  PONo : string
  WsCd: string
  Loc: string
  JOCPlanLot: string
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
  const [partNo, setPartNo] = React.useState("");
  const [supplier, setSupplier] = React.useState("");
  const [ETA, setETA] = React.useState("");
  const [Date, setDate] = React.useState("");
  const location = useLocation();
  const [suppliers,setSuppliers] = React.useState<Supplier[]>([]);
  const item = location.state;
  let totalqty;

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/completeData.php');
      setRows(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchSuppliers();
  fetchData();
}, []);

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
    const response = await axios.get("/api/completeData.php", {
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
    const response = await axios.get("/api/completeData.php", {
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
    const response = await axios.get("/api/completeData.php", {
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
    const response = await axios.get("/api/completeData.php", {
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
    const response = await axios.get("/api/completeData.php", {
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
        <FormLabel>Search for completion</FormLabel>
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

          <tbody>
            {stableSort(rows, getComparator(order, 'RefNo')).map((row) => (
              <Accordion key={row.RefNo}>
                <AccordionSummary>
                
              <tr>
                
                <td>
                  <Typography level='title-sm'>Ref No</Typography>
                  <Typography level="body-xs">{row.RefNo}</Typography>
                </td>
                <td>
                <Typography level='title-sm'>Part No</Typography>
                    <Typography level="body-xs">{row.PartNo}</Typography>
                </td>
                <td style={{width:200}}>
                <Typography level='title-sm'>Description</Typography>
                  <Typography level="body-xs">{row.Description}</Typography>
                </td>
                <td style={{width:180}}>
                <Typography level='title-sm'>Supplier</Typography>
                  <Typography level="body-xs">{row.Supplier}</Typography>
                </td>
                <td>
                <Typography level='title-sm'>PONo</Typography>
                  <Typography level="body-xs">{row.PONo}</Typography>
                </td>
                <td>
                <Typography level='title-sm'>WsCd</Typography>
                  <Typography level="body-xs">{row.WsCd}</Typography>
                </td>
                <td style={{width:100}}>
                <Typography level='title-sm'>Received Qty</Typography>
                
                <Typography level="body-xs">{totalqty = row.consume_data.reduce((a, b) => a + b.rcv_qty, 0)}</Typography>
             
                  </td>
                  <td style={{width:80}}>
                  <Typography level='title-sm'>Order Qty</Typography>
                  <Chip color='danger' variant='outlined' size='sm'>{row.Qty + totalqty}</Chip>
                </td>
                

                <td>
                <Typography level='title-sm'>Date</Typography>
                  <Typography level="body-xs">{row.Date}</Typography>
                </td>
                <td>
                <Typography level='title-sm'>Plan Lot</Typography>
                  <Typography level="body-xs">{row.JOCPlanLot}</Typography>
                </td>
                <td style={{ textAlign: 'center', width: 120 }}>
                 <Chip color='success'>Complete</Chip>
                </td>
              </tr>
             
              </AccordionSummary>
              <AccordionDetails>
              <Stepper orientation="vertical" sx={{padding:3,margin: 1,display:'flex'}}>
                {row.consume_data.map((consume,index) => (
                <Step
                indicator={
                  <StepIndicator variant="solid" color="primary">
                    {index + 1}
                  </StepIndicator>
                }
              ><Chip variant='soft' color='primary'>
                <Typography level="body-sm" startDecorator={<LocalShippingIcon/>}>
                    Time : {consume.rcv_time}
                  </Typography></Chip>
        
                <Stack spacing={1}>
                  <Typography level="body-sm">
                   Quantity : {consume.rcv_qty}
                  </Typography>
                  <Typography level="body-sm">
                   Date : {consume.rcv_date}
                  </Typography>
                  
                 
                </Stack>
              </Step>

                ))}
                 </Stepper>
              </AccordionDetails>
              </Accordion>
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
          to = '/dashboard'
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

