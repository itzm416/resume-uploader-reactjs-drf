import React, { useEffect, useState } from 'react'
import { Grid, TextField, Typography, FormControlLabel, Checkbox, Button, Box, Alert, InputLabel, MenuItem, Select, FormControl, FormLabel, RadioGroup, Radio, FormGroup, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

import axios from 'axios';

const ai = axios.create({
  baseURL : 'https://itzmyapi.herokuapp.com/api'
})

const App = () => {
  
  // -------------states----------------------
  
  const [resumelist, setResumelists] = useState([])
  const [allstates, setAllstates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState(null);
  const [state, setState] = useState('');
  const [gender, setGender] = useState('');
  const [locations, setlocation] = useState([]);
  const [profileimg, setProfileimg] = useState('');
  const [docfile, setDocfile] = useState('');
  
  const [l, setl] = useState({
    d1: false,
    d2: false
  });
  
  const [error, setError] = useState({
    status : false,
    msg : "",
    type : ""
  });
  
  // --------------hook----------------------
  
  useEffect( () => {
    async function getUser() {
      try {
        const response = await ai.get('/list/');
        setResumelists(response.data.candidate)
        setAllstates(response.data.states)
      } catch (error) {
        console.error(error);
      }
    }
    getUser()
  }, [error])
  
  // --------------handlechange----------------------

  const handlechangeL = (event) => {
    const { value, checked } = event.target
    
    // ----------------------
    setl({
      ...l,
      [event.target.name]: checked,
    });
    // ---------------------

    if(checked){
      let oldData = [...locations, value]
      setlocation(oldData)
    } else {
      let newarr = locations.filter( (e) => e!== value )
      setlocation(newarr)
    }
  }
  
  const handleChangeN = (event) => {
    setName(event.target.value);
  };

  const handleChangeE = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeD = (newValue) => {
    setDob(newValue);
  };

  const handleChangeS = (event) => {
    setState(event.target.value);
  };
  
  const handleChangeG = (event) => {
    setGender(event.target.value);
  };

  const handleChangePro = (event) => {
    setProfileimg(event.target.files[0]);
  };
  
  const handleChangeDoc = (event) => {
    setDocfile(event.target.files[0]);
  };

  const clearform = () => {
    setName('')
    setEmail('')
    setDob(null)
    setState('')
    setGender('')
    setlocation([])
    setProfileimg('')
    setDocfile('')
    setl({
      d1: false,
      d2: false
    })
  }

  const handleChangeSubmit = (event) => {
    event.preventDefault();
    const data = new FormData()
    data.append('name', name)
    data.append('email', email)
    data.append('dob', dob==null ? null : format(dob,'yyyy-MM-dd'))
    data.append('state', state)
    data.append('gender', gender)
    data.append('location', locations)
    data.append('userimage', profileimg)
    data.append('userdoc', docfile)
    
    if (data && name && email && dob && state && gender && locations && profileimg && docfile){
      setIsLoading(true)
      ai.post('/upload/', data)
      .then(function (response) {
        setIsLoading(false)
        clearform();
        setError({
          status : true,
          msg : "Resume Uploaded",
          type : "success"
        })
      })

    } else {
      setError({
        status : true,
        msg : "All field required",
        type : "error"
      })
    }
}
    
  return (
    <>

    <Box display="flex" justifyContent="center" sx={{backgroundColor:'success.light', padding:2}} >
      <Typography variant='h3' component="div" sx={{fontWeight:'bold', color:'white'}} >Resume Uploader</Typography>
    </Box>

    <Grid container justifyContent="center">

      <Grid item xs={12} sm={7} md={5} lg={6}>
        <Box display="flex" justifyContent="center" sx={{backgroundColor:'info.light', padding:1, marginTop:2, mx:1}} >
          <Typography variant='h5' component="div" sx={{fontWeight:'bold', color:'white'}} >From Of Resume</Typography>
        </Box>

        <Box component="form" onSubmit={handleChangeSubmit} id="resume-form" sx={{ p:3 }}>
          
          <TextField id="name" name="name" value={name} onChange={handleChangeN} required fullWidth margin="normal" label="Name" variant="outlined" />
          <TextField id="email" name="email" value={email} onChange={handleChangeE} required fullWidth margin="normal" label="Email" variant="outlined" />

          <Box sx={{mt:2}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker label="Date of Birth" value={dob} onChange={handleChangeD} renderInput={(params) => <TextField {...params} />} />
            </LocalizationProvider>
          </Box>

          <FormControl fullWidth sx={{mt:3}}>
            <InputLabel id="demo-simple-select-label">State</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={state}
              label="State"
              onChange={handleChangeS}
            >


            {
              allstates.map( (element, i) => {
                return(
                 
                  <MenuItem key={i} value={element[0]}>{element[0]}</MenuItem>
                )
              } )
            }

              
            </Select>
          </FormControl>

          <FormControl sx={{mt:3}}>
            <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={gender}
              onChange={handleChangeG}>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" fullWidth margin="normal" sx={{mt:3}}>
            <FormLabel component="legend" id="demo-row-radio-buttons-group-label">Preferred Job Location</FormLabel>
            <FormGroup row>
              <FormControlLabel name='d1' checked={l.d1} onChange={handlechangeL} value="Delhi" control={<Checkbox />} label="Delhi" />
              <FormControlLabel name='d2' checked={l.d2} onChange={handlechangeL} value="Haryana" control={<Checkbox />} label="Haryana" />
            </FormGroup>
          </FormControl>

          <Stack direction="row" alignItems="center" spacing={3}>

            <Button color="secondary" variant="contained" component="label">
              Upload Profile
              <input onChange={handleChangePro} id="resumeimg" hidden accept="image/*" multiple type="file" />
            </Button>

            <Button color="secondary" variant="contained" component="label">
              Upload File
              <input onChange={handleChangeDoc} id="resumedoc" hidden accept="doc/*" multiple type="file" />
            </Button>

          </Stack>

          <LoadingButton type='submit' endIcon={<SendIcon />} sx={{mt:2}} loading={isLoading} loadingPosition="end" variant="contained">
            Submit
          </LoadingButton>

          {error.status ? <Alert sx={{ mt:2 }} severity={error.type}>{error.msg}</Alert> : ''}
          
        </Box>

      </Grid>

      <Grid item xs={12} sm={5}>
        <Box display="flex" justifyContent="center" sx={{backgroundColor:'info.light', padding:1, marginTop:2, mx:1}} >
          <Typography variant='h5' component="div" sx={{fontWeight:'bold', color:'white'}} >List Of Resume</Typography>
        </Box>

        <TableContainer sx={{mx:1}} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table"> 

            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Doc</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">DOB</TableCell>
                <TableCell align="center">State</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Location</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            
            {
              resumelist.map( (element, i) => {
                 
                return(
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell align="center"> <Avatar src={`https://itzmyapi.herokuapp.com/.${element.userimage}`} /> </TableCell>
                  
                  <TableCell align="center"> 
                    <IconButton href={`https://itzmyapi.herokuapp.com/.${element.userdoc}`} aria-label="delete">
                      <FileOpenIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell align="center">{element.name}</TableCell>
                  <TableCell align="center">{element.email}</TableCell>
                  <TableCell align="center">{element.dob}</TableCell>
                  <TableCell align="center">{element.state}</TableCell>
                  <TableCell align="center">{element.gender}</TableCell>
                  <TableCell align="center">{element.location}</TableCell>
                  
                </TableRow>
                )
              } )
            }

                
            
            </TableBody>

          </Table>
        </TableContainer>



      </Grid>

    </Grid>

    </>
  )
}

export default App

