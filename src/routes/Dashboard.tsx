import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { useLocation, Link as RouteLink } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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
  const [supplier, setSupplier] = React.useState<Supplier>();
  const [twoHoursBefore, setTwoHoursBefore] = React.useState<string>("");
  const [twoHoursAfter, setTwoHoursAfter] = React.useState<string>("");
  ChartJS.register(ArcElement, Tooltip, Legend);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/countItem.php");
        setRows(response.data.data);
        setSupplier(response.data.supplier);
        setIncoming(response.data.etaWithinRange);
        setTwoHoursBefore(response.data.twoHoursBefore);
        setTwoHoursAfter(response.data.twoHoursAfter);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  const chartData = {
    labels: [""],
    datasets: [
      {
        data: [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: "#fff", // Optional: Color for the borders of slices
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "Pie Chart Title",
    },
    maintainAspectRatio: false, // Adjust the chart's width based on container size
    responsive: true, // Enable responsiveness for different screen sizes
  };

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
                    <Typography level="title-lg">Receiving Pending</Typography>
                  </CardContent>
                  <Sheet
                    sx={{
                      maxHeight: 100,
                      overflow: "auto",
                    }}
                  >
                    {rows.map((row, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Badge
                          anchorOrigin={{ vertical: "top", horizontal: "left" }}
                          badgeInset="2%"
                          color="danger"
                          sx={{
                            [`& .${badgeClasses.badge}`]: {
                              "&::after": {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                animation: "ripple 1.2s infinite ease-in-out",
                                border: "2px solid",
                                borderColor: "success.500",
                                content: '""',
                              },
                            },
                            "@keyframes ripple": {
                              "0%": {
                                transform: "scale(1)",
                                opacity: 1,
                              },
                              "100%": {
                                transform: "scale(2)",
                                opacity: 0,
                              },
                            },
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
                        </Badge>

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
                    width: 320,
                    maxHeight: 350,
                    height: 350,
                    marginRight: 5,
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
                              </Card>
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
                <Card></Card>
              </Item>
            </Grid>
            <Grid xs={4}>
              <Item>
                <Card variant="outlined" sx={{ width: 320, maxHeight: 500 }}>
                  <CardContent>
                    <Typography level="title-lg">Scan Pending</Typography>
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
                    <Badge
                      anchorOrigin={{ vertical: "top", horizontal: "left" }}
                      badgeInset="2%"
                      color="danger"
                      sx={{
                        [`& .${badgeClasses.badge}`]: {
                          "&::after": {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            animation: "ripple 1.2s infinite ease-in-out",
                            border: "2px solid",
                            borderColor: "success.500",
                            content: '""',
                          },
                        },
                        "@keyframes ripple": {
                          "0%": {
                            transform: "scale(1)",
                            opacity: 1,
                          },
                          "100%": {
                            transform: "scale(2)",
                            opacity: 0,
                          },
                        },
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
                        20-5-2024
                      </Chip>
                    </Badge>

                    <Link
                      level="body-sm"
                      underline="none"
                      startDecorator={<DocumentScannerIcon />}
                      endDecorator={<ArrowForwardIosIcon />}
                      sx={{
                        fontWeight: "md",
                        color: "text.secondary",
                        "&:hover": { color: "primary.plainColor" },
                      }}
                    >
                      1 items
                    </Link>
                  </Box>
                </Card>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
