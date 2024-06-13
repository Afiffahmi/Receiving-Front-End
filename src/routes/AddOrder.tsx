import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { useLocation, Link as RouteLink } from "react-router-dom";
import ActivityLegend from "../ActivityLegend";
import { Link as RouterLink } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import Sidebar from "../components/Sidebar";
import { Option, Select, alertClasses } from '@mui/joy';
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Header from "../components/Header";
import Card from "@mui/joy/Card";
import { Divider, Chip, Stack, Button,ButtonGroup } from "@mui/joy";
import axios from "axios";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Checkbox from '@mui/joy/Checkbox';
import Add from '@mui/icons-material/Add';
import "../ActivityGrid.css";
import Table from '@mui/joy/Table';
import { useNavigate } from "react-router-dom";


const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

interface user {
  username: string;
  userid : number;
  staffid: string;
  type: string;
  approval: number;
}
interface Supplier {
  id: number;
  SupplierName: string;
  SupplierFirstName: string;
}


export default function JoyOrderDashboardTemplate() {
  const authorize = localStorage.getItem("token");

  //@ts-ignore
  const id = JSON.parse(authorize);

  const [rows, setRows] = React.useState<user[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [type, setType] = React.useState("0");
  const [suppliers,setSuppliers] = React.useState<Supplier[]>([]);
  const [RefNo, setRefNo] = React.useState("");
  const [PartNo, setPartNo] = React.useState("");
  const [Description, setDescription] = React.useState("");
  const [PONo, setPONo] = React.useState("");
  const [Quantity, setQuantity] = React.useState(0);
  const [WSCD, setWSCD] = React.useState("");
  const [Date, setDate] = React.useState("");
  const [ETA, setETA] = React.useState("");
  const [PlanLot, setPlanLot] = React.useState("");
  const [supplier, setSupplier] = React.useState("");
  React.useEffect(() => {
    fetchSuppliers();
  }, []);


  const fetchSuppliers = async () => {
    try {
        const response = await axios.get('/api/supplierData.php');
        setSuppliers(response.data.data);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
  };

  const fetchSupplier = async (
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) => {
    setSupplier(newValue!);
  };

 
  //@ts-ignore
  const checker = JSON.parse(authorize);
  const navigate = useNavigate();
  React.useEffect(() => 
  {
    const response = axios.get("/api/userData.php");

    response.then((res) => {
      setRows(res.data.data);
    });

    
  })

  React.useEffect(() => {
    //@ts-ignore
    if(checker.type !== '3'){
      alert('youre not suppose to be here!!')
      navigate('/dashboard')
    }
  },[])




  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Update user detail</DialogTitle>
          <DialogContent>Fill in the information of the user.</DialogContent>
          
        </ModalDialog>
      </Modal>
    </React.Fragment>
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Add Order
              </Link>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
            Add Order
            </Typography>

           
          </Box>
          <Grid container sx={{ flexGrow: 1 }}>
            
            <Grid xs={12}>
              <Item>
                <Sheet sx={{ height: 550,width:1000,overflow:'auto',justifySelf:'center',justifyCenter:'center'}}>
                  
                  <Sheet
                    sx={{
                      display: "flex",
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    
              <form
                onSubmit={async(event: any) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  

                  if (RefNo !== "" && PartNo !== "" && Description !== "" && PONo !== "" && Quantity !== 0 && WSCD !== "" && Date !== "" && ETA !== "" && PlanLot !== " ") {
                    const url = "/api/order.php";

                    const data = {
                      RefNo : RefNo,
                      PartNo : PartNo,
                      Description : Description,
                      PONo : PONo,
                      Qty: Quantity,
                      Quantity : Quantity,
                      WSCD : WSCD,
                      Date : Date,
                      ETA : ETA,
                      JOCPlanLot : PlanLot,
                      Supplier : supplier,
                      staffName: id.username,
                      
                    };

                    const headers = {
                      "Content-Type": "application/json",
                      "Accept": "application/json",
                    };
                    
              
                    const response = await axios.post(url, JSON.stringify(data), {
                      headers: headers,
                    });
                    
                    console.log(response.data);
                  if(response.data.message){
                    alert(response.data.message);
                    setRefNo("");
                    setPartNo("");
                    setDescription("");
                    setPONo("");
                    setQuantity(0);
                    setWSCD("");
                    setDate("");
                    setETA("");
                    setPlanLot("");

                  }else{
                    alert(response.data.error);
                  }
                  }
                  setOpen(false);
                }}
              >
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
            <Option key={supplier.id} value={supplier.SupplierName}>{supplier.SupplierName}</Option>
           ))}
        </Select>
      </FormControl>
                <Stack direction="row" spacing={2}>
                <FormControl required>
                  <FormLabel>Reference Number</FormLabel>
                  <Input type="text" name="email" value={RefNo} onChange={(e)=> setRefNo(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Part Number</FormLabel>
                  <Input type="text" name="name" value={PartNo} onChange={(e)=> setPartNo(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Description</FormLabel>
                  <Input type="text" name="name" value={Description} onChange={(e)=> setDescription(e.target.value)}/>
                </FormControl>
                </Stack>
                
                <Stack direction="row" spacing={2}>
                <FormControl required>
                  <FormLabel>PO Number</FormLabel>
                  <Input type="text" name="name" value={PONo} onChange={(e)=> setPONo(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Quantity</FormLabel>
                  <Input type="number" name="name" value={Quantity} onChange={(e)=> setQuantity(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>WS CD</FormLabel>
                  <Input type="text" name="name" value={WSCD} onChange={(e)=> setWSCD(e.target.value)}/>
                </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                <FormControl required>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" name="name" value={Date} onChange={(e)=> setDate(e.target.value)}/>
                </FormControl>
                
                <FormControl required>
                  <FormLabel>ETA</FormLabel>
                  <Input type="time" name="name" value={ETA} onChange={(e)=> setETA(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Plan Lot</FormLabel>
                <Input type="text" name="name" value={PlanLot} onChange={(e)=> setPlanLot(e.target.value)}/>
                </FormControl>
                </Stack>
                

                
                
                <Stack gap={4} sx={{ mt: 2 }}>
                 
                  <Button type="submit" fullWidth>
                    Add
                  </Button>
                </Stack>
              </form>
            
                  </Sheet>
                </Sheet>
              </Item>
            </Grid>
           
            
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
