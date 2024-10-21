import React, { useState, useEffect } from 'react';
import PrimSecTempLineChart from '../components/PrimSecTempLineChart';
import { getSecondaryTemperatureData, getPrimaryTemperatureData, getLocations } from '../api/energoterm_api.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { FormControl, InputLabel, Select, MenuItem, Box, CircularProgress} from '@mui/material';

const PrimSecTempsPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('TPS Lamela L8');
  const [secondaryTemperatureData, setSecondaryTemperatureData] = useState([]);
  const [primaryTemperatureData, setPrimaryTemperatureData] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
        if (data.length > 0) {
          setSelectedLocation(data[0]); 
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  
  useEffect(() => {
    if (selectedLocation) {
      const fetchSecondaryTemperatureData = async () => {
        try {
          const data = await getSecondaryTemperatureData(selectedLocation);
          console.log('Secondary Temperature Data:', data);
          setSecondaryTemperatureData(data);
        } catch (error) {
          console.error("Failed to fetch secondary temperature data:", error);
        }
      };

      const fetchPrimaryTemperatureData = async () => {
        try {
          const data = await getPrimaryTemperatureData(selectedLocation);
          console.log('Primary Temperature Data:', data);
          setPrimaryTemperatureData(data);
        } catch (error) {
          console.error("Failed to fetch primary temperature data:", error);
        }
      };

      fetchSecondaryTemperatureData();
      fetchPrimaryTemperatureData();
    }
  }, [selectedLocation]);

  return (
    <div>
      <Navbar />
      <div className='cont' style={{ width:'100%', marginTop:'-20px', marginBottom:'100px', paddingRight:'300px'}}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            paddingTop: '100px',
            width: '100%',
            color:'white'
          }}
        >
          <FormControl variant="outlined"
              sx={{
                '& .MuiPickersDay-root': {
                  color: 'white',
                },
                '& .MuiInputBase-root': {
                  color: 'white',
                  backgroundColor: '#424242',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& input': {
                  color: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '&.Mui-focused .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiButtonBase-root': {
                  color: 'white', 
                },
              }}>
            <InputLabel id="location-select-label" sx={{ 
                color: 'white', 
                '&.Mui-focused': { color: 'white' }, 
              }}>Lokacija</InputLabel>
            <Select
              labelId="location-select-label"
              sx={{
                color: 'white',
                borderColor: 'white',
                '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: '#ff5722',
                },
                '& .MuiSelect-select': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                '&:before': { borderBottom: '1px solid white' },
                '&:after': { borderBottom: '1px solid white' },
                '&.Mui-focused': { borderColor: 'white' },
                '&.MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' },
                    '& .MuiSelect-icon': { color: 'white' },
                },
                '& .MuiPickersDay-root:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            },
            }}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              label="Lokacija"
            >
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              width: '100%', 
              maxWidth: '1200px', 
              marginTop: '20px' 
            }}
          >
            <PrimSecTempLineChart 
              data={secondaryTemperatureData} 
              dataKeySup="t_sup_sec" 
              dataKeyRet="t_ret_sec" 
              title="Temperature sekundarnog kruga" 
            />
            <PrimSecTempLineChart 
              data={primaryTemperatureData} 
              dataKeySup="t_sup_prim" 
              dataKeyRet="t_ret_prim" 
              title="Temperature primarnog kruga" 
            />
          </Box>
        </Box>
        </div>
        <Footer />
    </div>
  );
};

export default PrimSecTempsPage;
