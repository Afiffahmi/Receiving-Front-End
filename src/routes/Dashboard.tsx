import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { useLocation, Link as RouteLink } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import ActivityLegend from "../ActivityLegend";
import { Link as RouterLink } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

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
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import axios from "axios";
import Badge, { badgeClasses } from "@mui/joy/Badge";
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
          </Box>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid xs={4}>
              <Item>
                <Card sx={{ height: 350 }}>
                  <CardOverflow>
                    <AspectRatio ratio="2" sx={{ padding: 1 }}>
                      <img src="https://static.wixstatic.com/media/cb773a_33b784a330d4441abbee8dec56ffb840~mv2.gif" />
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">Previous Pending History</Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 100,
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
                          variant="outlined"
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
                              <ListItemButton component={RouterLink}
                              to="/receiveinfo"
                              state={{
                                RefNo: [row.RefNo],
                              }}>
                              <Card
                                sx={{ width: 500 }}
                                color="primary"
                                variant="soft"
                              >
                                <Typography level="title-sm">
                                  {row.Supplier}
                                </Typography>
                                <CardContent>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography level="body-sm">
                                      {row.RefNo}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {row.ETA}
                                    </Typography>
                                  </Stack>
                                </CardContent>
                              </Card></ListItemButton>
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
                    width: 320,
                    maxHeight: 350,
                    height: 350,
                    marginRight: 1,
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
                              <ListItemButton component={RouterLink}
                              to="/receiveinfo"
                              state={{
                                RefNo: [row.RefNo],
                              }}>
                              <Card
                                sx={{ width: 500 }}
                                color="danger"
                                variant="soft"
                              >
                                <Typography level="title-sm">
                                  {row.Supplier}
                                </Typography>
                                <CardContent>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                  >
                                    <Typography level="body-sm">
                                      {row.RefNo}
                                    </Typography>
                                    <Typography level="body-sm">
                                      {row.ETA}
                                    </Typography>
                                  </Stack>
                                </CardContent>
                              </Card></ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </ListItem>
                    </List>
                  </Sheet>
                </Card>
              </Item>
            </Grid>
            <Grid xs={8} sx={{ mr: 1.0 }}>
              <Item>
                <Card variant="outlined" sx={{ width: 800, maxHeight: 150 }}>
                  <CardContent>
                    <Typography level="title-lg">
                      Hourly Delivery Tracker{" "}
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
                        const cellData = hourlyData.find(d => d.hour === hour) || { hour, count: 0 };
                        const intensity = cellData.count / maxCount;
                        let backgroundColor, textColor;

                        if (hour < currentHour) {
                            backgroundColor = `rgba(255, 0, 0, ${intensity})`; // Red color for past hours
                            textColor = intensity > 0.5 ? 'white' : 'black';
                        } else {
                            backgroundColor = `rgba(0, 0, 255, ${intensity})`; // Blue color for current and future hours
                            textColor = intensity > 0.5 ? 'white' : 'black';
                        }

                        return (<Sheet>

                       
                            <div
                                key={hour}
                                className="cell"
                                style={{ backgroundColor, color: textColor }}
                            >
                                <div>{cellData.count}</div>
                                
                            </div><div className="hour">{hour}:00</div>
                            </Sheet>
                        );
                    })}
                      </div>
                    </div>
                  </Box>
                </Card>
              </Item>
            </Grid>
            <Grid xs={3}>
              <Item>
                <Card sx={{ height: 150,width:310 }}>
                  <CardContent>
                    <Typography level="title-lg">Legend</Typography>
                    <ActivityLegend maxCount={maxCount} />
                  </CardContent>
                </Card>
              </Item>
            </Grid>{" "}
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
