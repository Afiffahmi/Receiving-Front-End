/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import axios from 'axios';
import {useLocation} from 'react-router-dom';

import {Link as RouterLink } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

export interface Receive {
    id: string;
    receiveID:   number;
    RefNo:       string;
    PartNo:      string;
    Description: string;
    DelPt:       string;
    Supplier:    string;
    PONo:        string;
    Qty:         number;
    WsCd:        string;
    Loc:         string;
    Date:        string;
    ETA:         string;
    TransDt:     string;
    ProcessDt:   string;
    RcvDt:       string;
    RcvQty:      number;
    JOCPlanLot:  string;
    OstdQty:     number;
    BatchID:     string;
    Buyer:       string;
    reg_date:    string;
    status:     string;
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

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
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
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
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
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<Receive[]>([]);
  const [partNo, setPartNo] = React.useState('');
  const location = useLocation();
  const item = location.state;

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/receiveData.php',{params : item});
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);


const fetchData = async (input: string) => {
  console.log({ ...item, part_no: input })
  try {
    const response = await axios.get('/api/receiveData.php', {
      params: { ...item, part_no: input },
    });
    
    setRows(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors gracefully (e.g., display error message to user)
  }
};



  const renderFilters = () => (
    <React.Fragment>
     
      
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
       
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            maxWidth: { xs: '120px', md: '800px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for receiving</FormLabel>
          <Input size="sm" placeholder="Search by Part Number" startDecorator={<SearchIcon />} onChange={(e)=>{fetchData(e.target.value)}}/>
        </FormControl>
       

        {renderFilters()}
      </Box>
      
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
          maxWidth: '100%',
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
         
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.RefNo) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  RefNo
                </Link>
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Part No</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Description</th>
              <th style={{ width: 200, padding: '12px 6px' }}>Supplier</th>
              <th style={{ width: 80, padding: '12px 6px' }}>PO No</th>
              <th style={{ width: 60, padding: '12px 6px' }}>Qty</th>
              <th style={{ width: 70, padding: '12px 6px' }}>WS CD</th>
              <th style={{ width: 65, padding: '12px 6px' }}>Loc</th>
              <th style={{ width: 80, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 80, padding: '12px 6px' }}>ETA</th>
              <th style={{ width: 70, padding: '12px 6px' }}>JOC/Plan lot</th>


            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, 'RefNo')).map((row) => (
              <tr key={row.RefNo}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.RefNo)}
                    color={selected.includes(row.RefNo) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.RefNo)
                          : ids.filter((itemId) => itemId !== row.RefNo),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
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
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
          maxWidth: '50%',
        }}
      >
        <Button
          component={RouterLink}
          to = '/selection'
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
          component = {RouterLink}
          to = "/receiveinfo"
          state={{
            RefNo : selected,
          }}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}

