import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useNavigate,Link} from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import logo from '../assets/logo.png';
import { closeSidebar } from '../utils';
import { Chip } from '@mui/joy';

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}


export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/',{replace:true});
  };

  const id = (localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : ""  );

  
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <img src={logo} height={150} width={150} style={{alignSelf:'center',position:'absolute',right:50, top:0}}/>
        
      </Box>
    
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
        

          <ListItem component={Link} to='/dashboard' sx={{marginTop:10}} >
            <ListItemButton>
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Dashboard</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <Chip sx={{marginTop:2, boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)'}} color='primary' variant='solid'>Receive</Chip>
          <ListItem component={Link} to='/selection'>
            <ListItemButton>
              <LocalShippingIcon />
              <ListItemContent>
                <Typography level="title-sm">Receive Order</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <AssignmentRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Receiving Info</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }} component={Link} to='/alldelivery'>
                  <ListItemButton>All Delivery</ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/pending'>
                  <ListItemButton>Pending delivery</ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/transaction'>
                  <ListItemButton>Incomplete delivery</ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/complete'>
                  <ListItemButton>Transaction History</ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
          <Chip sx={{marginTop:2, boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)'}} color='warning' variant='solid'>Invoice</Chip>
          <ListItem component={Link} to='/scanner' >
            
            <ListItemButton>
              <DocumentScannerIcon />
              <ListItemContent>
                <Typography level="title-sm">Scan Invoice</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <AssignmentRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Scanning Info</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>

                <ListItem sx={{mt:0.5}} component={Link} to='/scan_pending'>
                  <ListItemButton>Pending Invoice Scanning</ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/scan_complete'>
                  <ListItemButton>Transaction history</ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

          <Chip sx={{marginTop:2, boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',backgroundColor: 'purple', // Set your desired purple color
    color: 'white'}} >Maintenance</Chip>
          <ListItem component={Link} to='/supplier' >
            <ListItemButton>
              <SettingsIcon />
              <ListItemContent>
                <Typography level="title-sm">Partner Maintenance</Typography>
              </ListItemContent>
            </ListItemButton>
            
          </ListItem>

          

          <ListItem component={Link} to='/admin' >
            <ListItemButton>
              <BrightnessAutoRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Admin Dashboard</Typography>
              </ListItemContent>
            </ListItemButton>
            
          </ListItem>

        </List>

        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
        
        </List>
        
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar >{id.username[0]}</Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{id.username}</Typography>
          <Typography level="body-xs">{id.StaffID}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={handleLogout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}