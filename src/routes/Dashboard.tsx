import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { useLocation, Link as RouteLink } from "react-router-dom";

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
import { Divider, Chip } from "@mui/joy";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import axios from "axios";
import FileUpload from "../components/FileUpload";
import Badge, { badgeClasses } from "@mui/joy/Badge";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";



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
}

export interface Daum {
  Date: string;
  Count: number;
}

export default function JoyOrderDashboardTemplate() {
  const [rows, setRows] = React.useState<Daum[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/countItem.php");
        setRows(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          <Grid container spacing={2} sx={{ flexGrow: 1 }} >
            <Grid xs={4} >
              <Item>
                <Card variant="soft" sx={{ width: 320 }}color='warning'>
                  <CardOverflow>
                    <AspectRatio ratio="2" sx={{ padding: 1 }}>
                    <img src='https://static.wixstatic.com/media/cb773a_33b784a330d4441abbee8dec56ffb840~mv2.gif'/>
                    </AspectRatio>
                  </CardOverflow>
                  <CardOverflow>
                    <Divider />
                  </CardOverflow>
                  <CardContent>
                    <Typography level="title-lg">Receiving Pending</Typography>
                  </CardContent>

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
                </Card>
              </Item>
            </Grid>
            <Grid xs={4} >
            <Item>
                <Card variant="outlined" sx={{ width: 320, maxHeight:500 }}>

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
            <Grid xs={4} >
              <Item>
                
              <FileUpload />
              </Item>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
