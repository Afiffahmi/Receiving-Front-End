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
import CheckIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import Sidebar from "../components/Sidebar";
import { Option, Select, alertClasses } from '@mui/joy';
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Header from "../components/Header";
import Card from "@mui/joy/Card";
import { Divider, Chip, Stack, Button,ButtonGroup } from "@mui/joy";
import axios from "axios";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Checkbox from '@mui/joy/Checkbox';
import Add from '@mui/icons-material/Add';
import "../ActivityGrid.css";
import Table from '@mui/joy/Table';
import { useNavigate } from "react-router-dom";


const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
  ...theme.typography["body-sm"],
  textAlign: "center",
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

interface user {
  username: string;
  userid : number;
  staffid: string;
  type: string;
  approval: number;
}


export default function JoyOrderDashboardTemplate() {
  const authorize = localStorage.getItem("token");
  const [rows, setRows] = React.useState<user[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [type, setType] = React.useState("0");
  const [username, setUsername] = React.useState("");
  const [staffid, setStaffid] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userid, setUserID] = React.useState(0);
  const [approval,setApproval] = React.useState(0);


 
  //@ts-ignore
  const checker = JSON.parse(authorize);
  const navigate = useNavigate();
  React.useEffect(() => 
  {
    const response = axios.get("/api/userData.php");

    response.then((res) => {
      setRows(res.data.data);
    });

    
  })

  React.useEffect(() => {
    //@ts-ignore
    if(checker.type !== '3'){
      alert('youre not suppose to be here!!')
      navigate('/dashboard')
    }
  },[])

  const handleDelete = (id: number) => {
    const response = axios.delete(`/api/user.php`,{
      data: {
        userid: id,
      },
    
    });


    response.then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        setRows(rows.filter((row) => row.userid !== id));
      } else {
        toast.error(res.data.message);
      }
    });
  }

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null) => {
    setType(newValue!);
    };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
      <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Update user detail</DialogTitle>
          <DialogContent>Fill in the information of the user.</DialogContent>
          <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={async(event: any) => {
                  event.preventDefault();
                  const formElements = event.currentTarget.elements;
                  

                  if (staffid !== "" && username !== "") {
                    const url = "/api/user.php";

                    const data = {
                      userid: userid,
                      staffid: staffid,
                      username: username,
                      type: type,
                      approval: approval
                      
                    };

                    const headers = {
                      "Content-Type": "application/json",
                      "Accept": "application/json",
                    };
                    
              
                    const response = await axios.put(url, JSON.stringify(data), {
                      headers: headers,
                    });
                    
                    
                  if(response.data.message){
                    alert(response.data.message);
                  }else{
                    alert(response.data.error);
                  }
                  }
                  setOpen(false);
                }}
              >
                <FormControl required>
                  <FormLabel>Staff ID</FormLabel>
                  <Input type="text" name="email" value={staffid} onChange={(e)=> setStaffid(e.target.value)}/>
                </FormControl>
                <FormControl required>
                  <FormLabel>Staff Name</FormLabel>
                  <Input type="text" name="name" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                </FormControl>

                <FormControl required>
                <FormLabel>Type</FormLabel>
                  <Select onChange={handleChange} placeholder={'select your user type...'}>
                    <Option value="1">Data group</Option>
                    <Option value="2">Operator</Option>
                    <Option value="3">Superuser</Option>
                  </Select>
                </FormControl>

                <FormControl required>
                <FormLabel>Verification</FormLabel>
                <Stack direction={'row'}>
                  <ButtonGroup>
                    <Button value="1" onClick={()=>setApproval(1)}>Approve</Button>
                    <Button value="0" onClick={()=>setApproval(0)}>Disapprove</Button>
                  </ButtonGroup>
                 
                  <Box sx={{mt:1,ml:3}}>
                     {/* @ts-ignore */}
                  {approval === 1 ? <CheckIcon color='success'/> : <CancelIcon color='danger'/>}</Box>
                  </Stack>
                </FormControl>
                
                <Stack gap={4} sx={{ mt: 2 }}>
                 
                  <Button type="submit" fullWidth>
                    Update
                  </Button>
                </Stack>
              </form>
            </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
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
                Update User
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
             Update User
            </Typography>

           
          </Box>
          <Grid container spacing={6} sx={{ flexGrow: 1 }}>
            
            <Grid xs={12}>
              <Item>
                <Sheet sx={{ height: 350,overflow:'auto'}}>
                  
                  <Sheet
                    sx={{
                      display: "flex",
                      overflow: "auto",
                      m: 1,
                    }}
                  >
                    <Table>
   
      <thead>
        <tr>
          <th>User Name</th>
          <th>Staff ID</th>
          <th>Type</th>
          <th>Approve</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.userid}>
            <td>{row.username}</td>
            <td>{row.staffid}</td>
            <td>{row.type === "3" ? "Superuser" : row.type === "1" ? 'Data group' : 'Operator' }</td>
            <td>{row.approval ? <Chip color='success'>Approved</Chip>: <Chip color='warning'>waiting for approval</Chip>}</td>
            <td><Button onClick={() => {setOpen(true);
            setUsername(row.username);
            setStaffid(row.staffid);
            setType(row.type);
            setUserID(row.userid);
            setApproval(row.approval)
            }} sx={{mr:1}}>Update</Button><Button color='danger' onClick={()=>{handleDelete(row.userid)}}>Delete</Button></td>
          </tr>
        ))}
      </tbody>
    </Table>       
                  </Sheet>
                </Sheet>
              </Item>
            </Grid>
           
            
          </Grid>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
