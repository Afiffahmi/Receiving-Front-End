/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { Link as RouterLink } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Chip } from "@mui/joy";

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
  const [order, setOrder] = React.useState<Order>("asc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [suppliers,setSuppliers] = React.useState<Supplier[]>([]);
  const [rows, setRows] = React.useState<Receive[]>([]);
  const [etaTo, setEtaTo] = React.useState("");
  const [partNo, setPartNo] = React.useState("");
  const [supplier, setSupplier] = React.useState("");
  const [ETA, setETA] = React.useState("");
  const [Date, setDate] = React.useState("");
  const location = useLocation();
  const item = location.state;

 console.log(item);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/scanData.php", {
          params: item,
        });
        setRows(response.data);

      } catch (error) {
        console.error("Error fetching data:", error);
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
      const response = await axios.get("/api/scanData.php", {
        params: {
          ...item,
          part_no: input,
          supplier: supplier,
          date: Date,
          eta_from: ETA,
        },
      });

      setRows(response.data);
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
      const response = await axios.get("/api/receiveData.php", {
        params: {
          ...item,
          supplier: newValue,
          date: Date,
          eta_from: ETA,
          eta_to: etaTo,
        },
      });

      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors gracefully (e.g., display error message to user)
    }
  };

  const fetchDate = async (input: string) => {
    setDate(input);

    try {
      const response = await axios.get("/api/receiveData.php", {
        params: {
          ...item,
          date: input,
          supplier: supplier,
          eta_from: ETA,
          eta_to: etaTo,
        },
      });

      setRows(response.data);
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
      const response = await axios.get("/api/receiveData.php", {
        params: {
          ...item,
          date: Date,
          supplier: supplier,
          eta_from: ETA,
          eta_to: input,
        },
      });

      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors gracefully (e.g., display error message to user)
    }
  };

  const fetchEta = async (input: string) => {
    setETA(input);
    try {
      const response = await axios.get("/api/receiveData.php", {
        params: {
          ...item,
          date: Date,
          supplier: supplier,
          eta_from: input,
          eta_to: etaTo,
        },
      });

      setRows(response.data);
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
      <FormControl size="sm">
        <FormLabel>ETA(from)</FormLabel>
        <Input type="time" onChange={(e) => fetchEta(e.target.value)} />
      </FormControl>
      <FormControl size="sm">
        <FormLabel>ETA(to)</FormLabel>
        <Input type="time" onChange={(e) => fetchEtaTo(e.target.value)} />
      </FormControl>
      
      <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for scanning</FormLabel>
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
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            maxWidth: { xs: "120px", md: "500px" },
          },
        }}
      >
        

        {renderFilters()}
      </Box>

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
          maxWidth: "100%",
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
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.RefNo) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
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
              <th style={{ width: 140, padding: "12px 6px" }}>Supplier</th>
              <th style={{ width: 70, padding: "12px 6px" }}>PO No</th>
              <th style={{ width: 80, padding: "12px 6px" }}>Plan lot</th>
              <th style={{ width: 70, padding: "12px 6px" }}>WS CD</th>
              <th style={{ width: 65, padding: "12px 6px" }}>Loc</th>
              <th style={{ width: 80, padding: "12px 6px" }}>Date</th>
              <th style={{ width: 80, padding: "12px 6px" }}>ETA</th>
              <th style={{ width: 80, padding: "12px 6px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, "ETA")).map((row) => (
              <tr key={row.RefNo}>
                <td style={{ textAlign: "center", width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.RefNo)}
                    color={selected.includes(row.RefNo) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.RefNo)
                          : ids.filter((itemId) => itemId !== row.RefNo)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td>
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
                <td>
                  <Typography level="body-xs"><Chip size='sm' color='success' variant='solid'>Ready Scan</Chip></Typography>
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
          [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
          display: {
            xs: "none",
            md: "flex",
          },
          maxWidth: "50%",
        }}
      >
        <Button
          component={RouterLink}
          to="/selection"
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          component={RouterLink}
          to="/scaninfo"
          state={{
            RefNo: selected,
          }}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}
