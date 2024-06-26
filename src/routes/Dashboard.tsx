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

import Sidebar from "../components/Sidebar";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Header from "../components/Header";
import Card from "@mui/joy/Card";
import { Divider, Chip, Stack } from "@mui/joy";
import axios from "axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import "../ActivityGrid.css";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export interface Root {
  data: Daum[];
  supplier: Supplier;
  today: string;
  etaWithinRange: EtaWithinRange[];
  currentTime: string;
  twoHoursBefore: string;
  twoHoursAfter: string;
}

export interface Daum {
  Date: string;
  Count: number;
}

export interface Supplier {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  data: number[];
}

export interface EtaWithinRange {
  hour: "number";
  count: number;
  receiveID: number;
  RefNo: string;
  PartNo: string;
  Description: string;
  DelPt: string;
  Supplier: string;
  PONo: string;
  Qty: number;
  WsCd: string;
  Loc: string;
  Date: string;
  ETA: string;
  TransDt: string;
  ProcessDt: string;
  RcvDt: string;
  RcvQty: number;
  JOCPlanLot: string;
  OstdQty: number;
  BatchID: string;
  Buyer: string;
  reg_date: string;
  RefNos: string[];
}

export default function JoyOrderDashboardTemplate() {
  const [rows, setRows] = React.useState<Daum[]>([]);
  const [incoming, setIncoming] = React.useState<EtaWithinRange[]>([]);
  const [past, setPast] = React.useState<EtaWithinRange[]>([]);
  const [twoHoursBefore, setTwoHoursBefore] = React.useState<string>("");
  const [twoHoursAfter, setTwoHoursAfter] = React.useState<string>("");
  const [hourlyData, setHourlyData] = React.useState([]);
  const [today, setToday] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await axios.get("/api/countItem.php");
        setRows(response.data.data);
        setIncoming(response.data.etaWithinRange);
        setTwoHoursBefore(response.data.twoHoursBefore);
        setTwoHoursAfter(response.data.twoHoursAfter);
        setPast(response.data.pastEta);
        setHourlyData(response.data.hourlyData);
        setToday(response.data.today);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  //@ts-ignore
  const maxCount = Math.max(...hourlyData.map((d) => d.count), 0);
  const currentHour = new Date().getHours();

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
                Dashboard
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
              Dashboard
            </Typography>

            <Typography level="body-md">
              OCR Receiving Information System
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid xs={4}>
              <Item>
                <Card sx={{ height: 350 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2.8" sx={{ padding: 1 }}>
                      <img
                        src={
                          "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fc3585133-390c-45d3-962f-e50285206f8a_800x600.gif"
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
                      Previous Pending History
                    </Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 150,
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    {rows.map((row, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 5,
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Chip
                          variant="solid"
                          color="danger"
                          size="sm"
                          sx={{
                            borderRadius: "sm",
                            py: 0.25,
                            px: 0.5,
                          }}
                        >
                          {row.Date}
                        </Chip>

                        <Link
                          component={RouteLink}
                          to="/receiving"
                          state={{
                            date: row.Date,
                          }}
                          level="body-sm"
                          underline="none"
                          startDecorator={<LocalShippingIcon />}
                          endDecorator={<ArrowForwardIosIcon />}
                          sx={{
                            fontWeight: "md",
                            color: "text.secondary",
                            "&:hover": { color: "primary.plainColor" },
                          }}
                        >
                          {row.Count} items
                        </Link>
                      </Box>
                    ))}
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item>
                <Card
                  variant="outlined"
                  sx={{
                    maxHeight: 350,
                    height: 350,
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      maxHeight: 300,
                      overflow: "auto",
                      borderRadius: "sm",
                    }}
                  >
                    <List>
                      <ListItem nested>
                        <ListSubheader sticky sx={{ alignSelf: "center" }}>
                          <Typography level="title-md">
                            Incoming Delivery
                          </Typography>{" "}
                        </ListSubheader>
                        <Typography level="body-sm">
                          ({twoHoursBefore} - {twoHoursAfter})
                        </Typography>
                        <List>
                          {incoming.length === 0 && (
                            <ListItem
                              sx={{
                                alignItems: "center",
                                alignContent: "center",
                                alignSelf: "center",
                                marginTop: 10,
                              }}
                            >
                              <Stack direction="column">
                                <Typography level="body-sm">
                                  No incoming delivery
                                </Typography>
                              </Stack>
                            </ListItem>
                          )}
                          {incoming.map((row) => (
                            <ListItem>
                              <ListItemButton
                                component={RouterLink}
                                to="/receiving"
                                state={{
                                  RefNo: row.RefNos,
                                }}
                              >
                                <Card
                                  sx={{ width: 500 }}
                                  color="primary"
                                  variant="soft"
                                >
                                  <Stack
                                    direction="row"
                                    gap={5}
                                    sx={{ justifyContent: "space-between" }}
                                  >
                                    <Typography level="title-sm">
                                      {row.Supplier}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {today}
                                    </Typography>
                                  </Stack>
                                  <CardContent>
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                    >
                                      <Typography level="body-sm">
                                        {row.count} items
                                      </Typography>
                                      <Typography level="body-sm">
                                        {row.hour}:00
                                      </Typography>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    </List>
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item>
                <Card
                  variant="outlined"
                  sx={{
                    maxHeight: 350,
                    height: 350,
                  }}
                >
                  <Sheet
                    variant="plain"
                    sx={{
                      maxHeight: 300,
                      overflow: "auto",
                      borderRadius: "sm",
                    }}
                  >
                    <List>
                      <ListItem nested>
                        <ListSubheader sticky sx={{ alignSelf: "center" }}>
                          <Typography level="title-md">
                            Pending Delivery
                          </Typography>{" "}
                        </ListSubheader>
                        <List>
                          {past.length === 0 && (
                            <ListItem
                              sx={{
                                alignItems: "center",
                                alignContent: "center",
                                alignSelf: "center",
                                marginTop: 10,
                              }}
                            >
                              <Stack direction="column">
                                <Typography level="body-sm">
                                  No pending delivery
                                </Typography>
                              </Stack>
                            </ListItem>
                          )}
                          {past.map((row) => (
                            <ListItem>
                              <ListItemButton
                                component={RouterLink}
                                to="/receiving"
                                state={{
                                  RefNo: row.RefNos,
                                }}
                              >
                                <Card
                                  sx={{ width: 500 }}
                                  color="danger"
                                  variant="soft"
                                >
                                  <Stack
                                    direction="row"
                                    gap={5}
                                    sx={{ justifyContent: "space-between" }}
                                  >
                                    <Typography level="title-sm">
                                      {row.Supplier}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {today}
                                    </Typography>
                                  </Stack>

                                  <CardContent>
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                    >
                                      <Typography level="body-sm">
                                        {row.count} items
                                      </Typography>

                                      <Typography level="body-sm">
                                        {row.hour}:00
                                      </Typography>
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    </List>
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={10} sx={{}}>
              <Item>
                <Card
                  variant="outlined"
                  sx={{
                    alignContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <CardContent>
                    <Typography level="title-lg">
                      Partner Pending Delivery Status{" "}
                    </Typography>
                    <Typography level="body-sm">{today}</Typography>
                  </CardContent>

                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                   <div>
  <div className="grid">
    {Array.from({ length: 24 }).map((_, hour) => {
      //@ts-ignore
      const cellData = hourlyData.find((d) => d.hour === hour) || { hour, count: 0 };
      const intensity = cellData.count / maxCount;
      let backgroundColor,
        textColor,
        cellClass = "";

      if (hour < currentHour) {
        if (cellData.count === 0) {
          backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Green color for past hours with count 0
        } else {
          backgroundColor = `rgba(255, 0, 0, 0.5)`; // Red color for past hours
        }
        textColor = intensity >= 0.5 ? "white" : "black";
      } else if (hour === currentHour) {
        backgroundColor = `rgba(255, 234, 153, 3)`; // Yellow color for current hour
        cellClass = "blink"; // Add class for blinking
      }

      return (
        <Sheet key={hour}>
          <div
            className={`cell ${cellClass}`}
            style={{ backgroundColor, color: textColor }}
          >
            <div>{cellData.count}</div>
          </div>
          <div className="hour">{hour}:00</div>
        </Sheet>
      );
    })}
  </div>
</div>

                  </Box>
                </Card>
              </Item>
            </Grid>
            <Grid xs={2}>
              <Item>
                <Card sx={{}}>
                  <CardContent
                    sx={{
                      position: "flex",
                      alignSelf: "center",
                      justifyContent: "center",
                      justifyItems: "center",
                    }}
                  >
                    {/* <Typography level="title-lg">Legend</Typography>
                    <ActivityLegend maxCount={maxCount} /> */}
                    <Box component="footer" sx={{}}>
                      <Typography level="body-xs" textAlign="center">
                        Copyright © MHC Fahmi Rachel {new Date().getFullYear()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
