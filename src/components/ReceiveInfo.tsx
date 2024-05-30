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
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Transition } from "react-transition-group";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import Stepper from "@mui/joy/Stepper";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Step, { stepClasses } from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

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

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const textInputRef = React.useRef<HTMLInputElement>(null);
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
  const [total, setTotal] = React.useState(0);
  const [scan, setScan] = React.useState(0);
  const [itemNo, setItemNo] = React.useState("");
  const [input, setInput] = React.useState("");
  const [qty, setQty] = React.useState(0);
  const [focus, setFocus] = React.useState(true);

  const [active, setActive] = React.useState(true);
  const [complete, setComplete] = React.useState(false);
  //@ts-ignore
  const [data, setData] = React.useState<Receive>({});
  const location = useLocation();
  const item = location.state;
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/selectedReceive.php", item);
        if (response.data.data) {
          setRows(response.data.data);
          setTotal(response.data.total);
          setItemNo(response.data.data[0].PartNo);
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

    if (item.scan == item.itemNo && item.total >= scan + Number(item.qty)) {
      setScan(scan + Number(item.qty));
    } else if (item.total < scan + Number(item.qty)) {
      toast.error("Quantity exceed actual receiving quantity", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } else if (scan == item.total) {
      toast.error("Scanned quantity completed", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } else if (item.scan !== item.itemNo) {
      toast.error("Invalid Part No", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }

    setScan(item.qty ? item.qty : 0);

    fetchData();
  }, []);

  const firstInputRef = React.useRef(null);
  const secondInputRef = React.useRef<HTMLInputElement>(null);

  const handleScanner = () => {
    navigate("/scan", {
      replace: true,
      state: { ...item, itemNo: itemNo, total: total, prev_qty: scan },
    });
  };

  const handleManual = () => {
    if (input == itemNo && total >= scan + Number(qty)) {
      setScan(scan + Number(qty));
    } else if (total < scan + Number(qty)) {
      toast.error("Quantity exceed actual receiving quantity", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } else if (scan == total) {
      toast.error("Scanned quantity completed", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } else if (input !== itemNo) {
      toast.error("Invalid Part No", {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
    setInput("");
    setQty(0);
  };
  const handleInput = (input: string) => {
    setInput(input);

    if (input == "complete") {
      setOpen(true);
      setInput("");
    } else if (input == "reset") {
      setScan(0);
      setInput("");
    } else if (input == "start") {
      handleScanner();
    } else if (input == itemNo) {
      window.setTimeout(() => {
        navigate("/scanqty", {
          state: {
            ...item,
            scan: input,
            itemNo: itemNo,
            total: total,
            prev_qty: scan,
          },
          replace: true,
        });
      }, 2300);
    }else if(input.length >= 9 && input !== itemNo){
      setInput("");
      toast.error("Invalid Part No", {
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  const handleReceive = () => {
    setOpen(true);
  };

  const handleUpdate = async () => {
    let currentScan = scan; // Use a local variable to manage the scan value
    if (scan != 0) {
      setTotal(total - scan); // Update the total after all rows are processed
      for (const row of rows) {
        console.log(currentScan); // Now 'currentScan' will be updated for each row

        if (currentScan > row.Qty) {
          currentScan -= row.Qty;
          await axios.post("/api/updateReceive.php", { ...row, newQty: 0 });
          console.log("data submit", { ...row, newQty: 0 });
        } else {
          const newQty = row.Qty - currentScan;
          await axios.post("/api/updateReceive.php", { ...row, newQty });
          console.log("data submit", { ...row, newQty });
          currentScan = 0;
        }

        setScan(currentScan); // Schedule the state update after each iteration
      }
      setActive(false);
      setComplete(true);
      console.log("Update completed");
      toast.success("Receiving completed", { position: "bottom-right" });
      setTimeout(() => {
        navigate("/receiving", {
          replace: true,
          state: { supplier: data.Supplier, date: data.Date },
        });
      }, 8000);
    } else {
      toast.error("Please Scan the item first!", { position: "bottom-right" });
    }
  };

  return (
    <React.Fragment>
      <React.Fragment>
        <Transition in={open} timeout={400}>
          {(state: string) => (
            <Modal
              keepMounted
              open={!["exited", "exiting"].includes(state)}
              onClose={() => setOpen(false)}
              slotProps={{
                backdrop: {
                  sx: {
                    opacity: 0,
                    backdropFilter: "none",
                    transition: `opacity 400ms, backdrop-filter 400ms`,
                    ...{
                      entering: { opacity: 1, backdropFilter: "blur(8px)" },
                      entered: { opacity: 1, backdropFilter: "blur(8px)" },
                    }[state],
                  },
                },
              }}
              sx={{
                visibility: state === "exited" ? "hidden" : "visible",
              }}
            >
              <ModalDialog
                sx={{
                  opacity: 0,
                  transition: `opacity 300ms`,
                  ...{
                    entering: { opacity: 1 },
                    entered: { opacity: 1 },
                  }[state],
                }}
              >
                <DialogTitle>
                  <Typography level="h2">Receiving Information</Typography>
                </DialogTitle>
                <DialogContent>
                  <Stepper
                    size="lg"
                    sx={{
                      width: "100%",
                      "--StepIndicator-size": "3rem",
                      "--Step-connectorInset": "0px",
                      [`& .${stepIndicatorClasses.root}`]: {
                        borderWidth: 4,
                      },
                      [`& .${stepClasses.root}::after`]: {
                        height: 4,
                      },
                      [`& .${stepClasses.completed}`]: {
                        [`& .${stepIndicatorClasses.root}`]: {
                          borderColor: "primary.300",
                          color: "primary.300",
                        },
                        "&::after": {
                          bgcolor: "primary.300",
                        },
                      },
                      [`& .${stepClasses.active}`]: {
                        [`& .${stepIndicatorClasses.root}`]: {
                          borderColor: "currentColor",
                        },
                      },
                      [`& .${stepClasses.disabled} *`]: {
                        color: "neutral.outlinedDisabledColor",
                      },
                    }}
                  >
                    <Step
                      completed
                      orientation="vertical"
                      indicator={
                        <StepIndicator variant="outlined" color="primary">
                          <ShoppingCartRoundedIcon />
                        </StepIndicator>
                      }
                    />
                    <Step
                      orientation="vertical"
                      completed
                      indicator={
                        <StepIndicator variant="outlined" color="primary">
                          <ContactsRoundedIcon />
                        </StepIndicator>
                      }
                    />
                    <Step
                      orientation="vertical"
                      active={active}
                      completed={complete}
                      indicator={
                        <StepIndicator variant="outlined" color="primary">
                          <LocalShippingRoundedIcon />
                        </StepIndicator>
                      }
                    />

                    <Step
                      orientation="vertical"
                      active={!active}
                      completed={!complete}
                      indicator={
                        <StepIndicator variant="outlined" color="neutral">
                          <CheckCircleRoundedIcon />
                        </StepIndicator>
                      }
                    />
                  </Stepper>
                  <Sheet
                    sx={{
                      bgcolor: "background.level1",
                      borderRadius: "sm",
                      p: 1.5,
                      my: 1.5,
                      display: "flex",
                      gap: 2,
                      "& > div": { flex: 1 },
                    }}
                  >
                    <div>
                      <Typography level="body-xs" fontWeight="lg">
                        Supplier
                      </Typography>
                      <Typography fontWeight="lg">{data.Supplier}</Typography>
                    </div>
                    <div>
                      <Typography level="body-xs" fontWeight="lg">
                        Item No
                      </Typography>
                      <Typography fontWeight="lg">{itemNo}</Typography>
                    </div>
                    <div>
                      <Typography level="body-xs" fontWeight="lg">
                        Description
                      </Typography>
                      <Typography fontWeight="lg">
                        {data.Description}
                      </Typography>
                    </div>
                  </Sheet>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      "& > button": { flex: 1 },
                    }}
                  >
                    <Button variant="outlined" color="neutral" disabled>
                      Total item: {total}
                    </Button>
                    <Button variant="solid" color="primary" disabled>
                      Total Scan: {scan}
                    </Button>
                  </Box>

                  <Typography level="title-lg"></Typography>

                  <Button onClick={handleUpdate}>Confirm</Button>
                </DialogContent>
              </ModalDialog>
            </Modal>
          )}
        </Transition>
      </React.Fragment>
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
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
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
      <Card variant="solid" color="primary" invertedColors>
        <CardContent orientation="horizontal">
          <Typography>Total Scan:</Typography>
          <Avatar sx={{ width: 80, height: 80, mr: 2 }} color="primary">
            <Typography level="h2">{scan}</Typography>
          </Avatar>
          <CardContent></CardContent>
          <Typography level="body-md">Remain Qty:</Typography>
          <Avatar>
            <Typography level="title-lg">{total - scan}</Typography>
          </Avatar>
          <Typography level="body-md">Total item:</Typography>
          <Avatar>
            <Typography level="title-sm">{total}</Typography>
          </Avatar>
        </CardContent>

        <CardActions>
          <Input
            variant="soft"
            value={input}
            onChange={(e) => {
              handleInput(e.target.value);
            }}
            ref={firstInputRef}
            type="text"
            autoFocus={focus}
          />

          {/* <Input
          className='secondInput'
          ref={secondInputRef}
          type='number'
          variant='soft'
          value={qty}
          autoFocus={!focus}
          onChange={(e) => {if(Number(e.target.value) >= 0 )setQty(Number(e.target.value))}}
          /> */}
          {/* 

<Button onClick={handleManual} variant="solid" size="sm">
            Next
          </Button> */}

          {/* <Button onClick={handleScanner} variant="solid" size="sm">
            Scan
          </Button> */}
        </CardActions>
        <Button color="warning" onClick={handleReceive}>
          Received
        </Button>
      </Card>
    </React.Fragment>
  );
}
