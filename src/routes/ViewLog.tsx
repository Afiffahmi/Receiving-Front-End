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
import {CardContent} from '@mui/joy';

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

interface Order {
  receiveID: number
  RefNo: string
  PartNo: string
  Description: string
  DelPt: string
  Supplier: string
  PONo: string
  Qty: number
  WsCd: string
  Loc: string
  Date: string
  ETA: string
  TransDt: string
  ProcessDt: string
  RcvDt: string
  RcvQty: number
  JOCPlanLot: string
  OstdQty: number
  BatchID: string
  Buyer: string
  reg_date: string
  historyDate: string
  staffName: string
  action : string
}



export default function JoyOrderDashboardTemplate() {
  const authorize = localStorage.getItem("token");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  //@ts-ignore
  const checker = JSON.parse(authorize);
  const navigate = useNavigate();
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<Order[]>(
          '/api/order.php' // Replace with your actual API endpoint
        );
        setOrders(response.data);
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
                View Logs
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
            View Logs
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
                     <Card>
      <CardContent>
        {isLoading ? (
          <Typography level="title-lg">Loading...</Typography>
        ) : error ? (
          <Typography level="title-lg" color="danger">
            Error: {error}
          </Typography>
        ) : (
          orders.map((order:any) => (
            <Card sx={{display:'flex',overflow:'auto',maxHeight:900,mb:1}}>
            <Typography key={order.id} level="body-sm" sx={{display:'flex',justifyContent:'start'}}>
             <Chip variant='outlined' sx={{mr:1}}>{order.historyDate}</Chip> {order.action} <Typography variant='soft'> {order.staffName}</Typography>
            </Typography>
            <CardContent>
              <Table>
                <thead>
                  <th>
                    RefNo
                  </th>
                  <th>
                    PartNo
                  </th>
                  <th>
                    Description
                  </th>
                  <th>
                    Supplier
                  </th>
                  <th>
                    PONo
                  </th>
                  <th>
                    Qty
                  </th>

                </thead>
                <tbody>
                  <tr>
                    <td>{order.RefNo}</td>
                    <td>{order.PartNo}</td>
                    <td>{order.Description}</td>
                    <td>{order.Supplier}</td>
                    <td>{order.PONo}</td>
                    <td>{order.Qty}</td>
                  </tr>
                </tbody>

              </Table>
            </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
             
            
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
