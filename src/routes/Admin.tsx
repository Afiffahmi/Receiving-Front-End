import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { useLocation, Link as RouteLink, useNavigate } from "react-router-dom";
import ActivityLegend from "../ActivityLegend";
import { Link as RouterLink } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Header from "../components/Header";
import Card from "@mui/joy/Card";
import { Divider, Chip, Stack, Button,ButtonGroup } from "@mui/joy";
import axios from "axios";
import "../ActivityGrid.css";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));



export default function JoyOrderDashboardTemplate() {
  const authorize = localStorage.getItem("token");
  const navigate = useNavigate();
  //@ts-ignore
  const checker = JSON.parse(authorize);
  React.useEffect(() => 
  {

    //@ts-ignore
    if(checker.type !== '3'){
      alert('you re not suppose to be here!!')
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
                Admin Dashboard
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
             Admin Dashboard
            </Typography>

           
          </Box>
         
          <Grid container spacing={6} sx={{ flexGrow: 1 }}>
            <Grid xs={3}>
              <Item>
                <Card sx={{ height: 350,width:250 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2.8" sx={{ padding: 1 }}>
                      <img
                        src={
                          "https://imgvisuals.com/cdn/shop/products/animated-load-time-gradient-ui-icon-941101.gif?v=1697071131"
                        }
                        style={{
                          top: 0,
                          position: "absolute",
                          marginBottom: 10,
                        }}
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">
                      Change Logs
                    </Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 150,
                      overflow: "auto",
                      m: 1,
                    }}
                  > <Stack spacing={2}>
                    <Button onClick={()=>{navigate('/log')}}>
                      View Logs
                    </Button>
                    </Stack>
                   
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={3}>
              <Item>
                <Card sx={{ height: 350,width:250 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2.8" sx={{ padding: 1 }}>
                      <img
                        src={
                          "https://cdn.dribbble.com/users/366543/screenshots/2485833/emoji_reactions.gif"
                        }
                        style={{
                          top: 0,
                          position: "absolute",
                          marginBottom: 10,
                        }}
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">
                      Manage User
                    </Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 150,
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    <Stack spacing={2}>
                      
                      <Button onClick={()=>{
                        navigate('/update_user')
                      }}>Update User</Button>
                      
                      
                    </Stack>
                   
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={3}>
              <Item>
                <Card sx={{ height: 350,width:250 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2.8" sx={{ padding: 1 }}>
                      <img
                        src={
                          "https://cdn.dribbble.com/users/4908/screenshots/2787171/invoice-animation-dribbble.gif"
                        }
                        style={{
                          top: 0,
                          position: "absolute",
                          marginBottom: 10,
                        }}
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">
                      Manage Receiving
                    </Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 150,
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    <Stack spacing={2}>
                      <Button onClick={()=>navigate('/add_order')}>Add Order</Button>
                      <Button variant='outlined' onClick={
                        ()=>navigate('/modify_order')
                      }>Modify Existing Order</Button>
                      
                      
                    </Stack>
                   
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={3}>
              <Item>
                <Card sx={{ height: 350,width:250 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2.8" sx={{ padding: 1 }}>
                      <img
                        src={
                          "https://cdn.dribbble.com/users/391355/screenshots/4745767/comp-1_1.gif"
                        }
                        style={{
                          top: 0,
                          position: "absolute",
                          marginBottom: 10,
                        }}
                      />
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">
                      Manage Invoices
                    </Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 150,
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    <Stack spacing={2}>
                      <Button
                      onClick={()=>navigate('/modify_inv')}
                      >Modify Matches Invoices</Button>
                      
                      <Button variant='outlined'
                      onClick={()=>navigate('/scan_complete')}
                      >Matches Invoices History</Button>
                    </Stack>
                   
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
