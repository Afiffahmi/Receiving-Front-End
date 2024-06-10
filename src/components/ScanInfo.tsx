/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";

import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Barcode from "react-barcode";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Select,
  Option,
} from "@mui/joy";

export interface Receive {
  id: string;
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
  status: string;
  customer: {
    name: string;
    email: string;
    initial: string;
  };
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

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
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
  const [order, setOrder] = React.useState<Order>("desc");
  const [rows, setRows] = React.useState<Receive[]>([
    {
      id: "",
      receiveID: 0,
      RefNo: "",
      PartNo: "",
      Description: "",
      DelPt: "",
      Supplier: "",
      PONo: "",
      Qty: 0,
      WsCd: "",
      Loc: "",
      Date: "",
      ETA: "",
      TransDt: "",
      ProcessDt: "",
      RcvDt: "",
      RcvQty: 0,
      JOCPlanLot: "",
      OstdQty: 0,
      BatchID: "",
      Buyer: "",
      reg_date: "",
      status: "",
      customer: {
        name: "",
        email: "",
        initial: "",
      },
    },
  ]);

  interface Supplier {
    id: number;
    SupplierName: string;
    SupplierFirstName: string;
  }

  const [refno, setRefno] = React.useState("");
  const [itemNo, setItemNo] = React.useState("");
  const [pono, setPONo] = React.useState("");
  const [planlot, setPlanLot] = React.useState("");
  const [invno, setInvNo] = React.useState("");
  const [qty, setQty] = React.useState(0);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  //@ts-ignore
  const [data, setData] = React.useState<Receive>({});
  const location = useLocation();
  const item = location.state;
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/selectedScan.php", item);
        if (response.data.data) {
          setRows(response.data.data);
          setData(response.data.data[0]);
        } else if (response.data.error) {
          toast.error(response.data.error, {
            position: "bottom-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });

          setTimeout(() => {
            window.location.href = "/selection";
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchSuppliers();
  }, []);

  const dataID = {
    id: data.receiveID,
    invNo: invno,
  };

  const handleChecker = async () => {
    if (
      data.RefNo === refno &&
      data.PartNo === itemNo &&
      data.PONo === pono &&
      data.JOCPlanLot === planlot &&
      data.Qty == qty
    ) {
      const response = await axios
        .post("/api/pendingInvoice.php", dataID)
        .then((response) => {
          console.log(response);
          if (response.data.message) {
            toast.success(response.data.message, {
              position: "bottom-right",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
              transition: Bounce,
            });
          } else if (response.data.error) {
            toast.error(response.data.error, {
              position: "bottom-right",
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
              transition: Bounce,
            });
          }
        });
    } else {
      alert("Not Match!");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/supplierData.php");
      setSuppliers(response.data.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
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
        <IconButton size="sm" variant="outlined" color="neutral">
          <FilterAltIcon />
        </IconButton>
      </Sheet>

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "1080px",
          borderRadius: "sm",
          flexShrink: 0,
          overflow: "auto",
          minHeight: 0,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              ></th>
              <th style={{ width: 100, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  RefNo
                </Link>
              </th>

              <th style={{ width: 100, padding: "12px 6px" }}>Part No</th>
              <th style={{ width: 120, padding: "12px 6px" }}>Description</th>
              <th style={{ width: 200, padding: "12px 6px" }}>Supplier</th>
              <th style={{ width: 80, padding: "12px 6px" }}>PO No</th>
              <th style={{ width: 60, padding: "12px 6px" }}>Qty</th>
              <th style={{ width: 70, padding: "12px 6px" }}>WS CD</th>
              <th style={{ width: 65, padding: "12px 6px" }}>Loc</th>
              <th style={{ width: 80, padding: "12px 6px" }}>Date</th>
              <th style={{ width: 80, padding: "12px 6px" }}>ETA</th>
              <th style={{ width: 70, padding: "12px 6px" }}>JOC/Plan lot</th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, "RefNo")).map((row: any) => (
              <tr key={row.RefNo}>
                <td style={{ textAlign: "center", width: 120 }}></td>

                <td>
                  <Typography level="body-xs">{row.RefNo}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.PartNo}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.Description}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.Supplier}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.PONo}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.Qty}</Typography>
                </td>

                <td>
                  <Typography level="body-xs">{row.WsCd}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.Loc}</Typography>
                </td>

                <td>
                  <Typography level="body-xs">{row.Date}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.ETA}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.JOCPlanLot}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Typography sx={{ display: "flex", justifyContent: "center" }}>
        Upload invoice:
      </Typography>
      <Stack
        direction={"row"}
        sx={{
          alignItem: "center",
          alignContent: "center",
          display: "flex",
          justifyContent: "center",
          my: 2,
        }}
      >
        <FormControl size="sm">
          <FormLabel>Supplier</FormLabel>
          <Select
            onChange={fetchSuppliers}
            size="sm"
            placeholder="OCR Supplier"
            slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
          >
            <Option value="">All</Option>
            {suppliers.map((supplier) => (
              <Option key={supplier.id} value={supplier.SupplierFirstName}>
                {supplier.SupplierName}
              </Option>
            ))}
          </Select>
        </FormControl>
        <FormControl size="sm" sx={{ mx: 1 }}>
          <FormLabel>Upload Scanned Invoice</FormLabel>
          <Input type="file" variant="outlined" />
        </FormControl>
        <FormControl size="sm" sx={{ mt: 2 }}>
          <FormLabel></FormLabel>
          <Button variant="solid">Upload</Button>
        </FormControl>
      </Stack>

      <Card variant="soft" color="neutral">
        <CardContent orientation="horizontal">
          <Typography level="title-md">Scan Result</Typography>
        </CardContent>

        <CardActions
          sx={{
            alignItem: "center",
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack direction="column" spacing={2}>
            <FormControl error={refno != data.RefNo}>
              <FormLabel>Ref Number</FormLabel>
              <Input
                value={refno}
                onChange={(e) => {
                  setRefno(e.target.value);
                }}
                required
              />
              <FormHelperText></FormHelperText>
            </FormControl>

            <FormControl error={itemNo != data.PartNo}>
              <FormLabel>Part Number</FormLabel>
              <Input
                value={itemNo}
                onChange={(e) => {
                  setItemNo(e.target.value);
                }}
                required
              />
            </FormControl>
          </Stack>

          <Stack direction="column" spacing={2}>
            <FormControl error={qty != data.Qty}>
              <FormLabel>Quantity</FormLabel>
              <Input 
              value={qty}
              onChange={(e) => {
                setQty(Number(e.target.value));
              }}
               required />
            </FormControl>
            <FormControl error={pono != data.PONo}>
              <FormLabel>PO Number</FormLabel>
              <Input
              disabled={/[a-zA-Z]+/.test(data.PONo)}
                value={pono}
                onChange={(e) => {
                  setPONo(e.target.value);
                }}
                required
              />
            </FormControl>
          </Stack>

          <Stack direction="column" spacing={2}>
            <FormControl error={planlot != data.JOCPlanLot}>
              <FormLabel>Plan Lot</FormLabel>
              <Input
                value={planlot}
                onChange={(e) => {
                  setPlanLot(e.target.value);
                }}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Invoice Number</FormLabel>
              <Input
                color="primary"
                value={invno}
                onChange={(e) => {
                  setInvNo(e.target.value);
                }}
                required
              />
            </FormControl>
          </Stack>
        </CardActions>
        <Button
          variant="solid"
          onClick={handleChecker}
          disabled={!invno}
          sx={{
            width: 200,
            justifyContent: "center",
            alignContent: "center",
            alignItem: "center",
            display: "flex",
            alignSelf: "center",
          }}
        >
          Confirm
        </Button>
      </Card>
    </React.Fragment>
  );
}
