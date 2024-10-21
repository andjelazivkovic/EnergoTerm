import React, { useState, useEffect } from 'react';
import TemperatureLineChart from '../components/TemperatureLineChart';
import { getLocations, getTemperatureData } from '../api/energoterm_api.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Container, Grid, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // MUI DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Required for MUI date handling
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Adapter for dayjs library
import dayjs from 'dayjs'; // For handling date formatting
import '../styles/TemperaturePage.css';
import '../styles/Footer.css';

const TemperaturePage = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const fetchTemperatureData = async () => {
    const month = selectedDate.month() + 1;
    const year = selectedDate.year();
    try {
      const result = await getTemperatureData(selectedLocation, month, year);
      const dayDataMap = {};
      result.forEach(item => {
        const date = new Date(item.datetime).getDate();
        if (!dayDataMap[date]) {
          dayDataMap[date] = [];
        }
        dayDataMap[date].push(item);
      });

      const formattedData = Object.keys(dayDataMap).map(day => {
        const dailyData = dayDataMap[day];

        const t_amb_avg = dailyData.reduce((sum, item) => sum + item.t_amb, 0) / dailyData.length;
        const t_ref_avg = dailyData.reduce((sum, item) => sum + item.t_ref, 0) / dailyData.length;
        const t_sup_prim_avg = dailyData.reduce((sum, item) => sum + item.t_sup_prim, 0) / dailyData.length;
        const t_ret_prim_avg = dailyData.reduce((sum, item) => sum + item.t_ret_prim, 0) / dailyData.length;
        const t_sup_sec_avg = dailyData.reduce((sum, item) => sum + item.t_sup_sec, 0) / dailyData.length;
        const t_ret_sec_avg = dailyData.reduce((sum, item) => sum + item.t_ret_sec, 0) / dailyData.length;

        return {
          date: new Date(year, month - 1, day),
          t_amb: t_amb_avg,
          t_ref: t_ref_avg,
          t_sup_prim: t_sup_prim_avg,
          t_ret_prim: t_ret_prim_avg,
          t_sup_sec: t_sup_sec_avg,
          t_ret_sec: t_ret_sec_avg,
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching temperature data:", error);
    }
  };

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);
        if (locationsData.length > 0) {
          setSelectedLocation(locationsData[0]);
        }
      } catch (error) {
        console.error("Error loading locations:", error);
      }
    };
    loadLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchTemperatureData();
    }
  }, [selectedDate, selectedLocation]);

  const ambientAndReferenceKeys = [
    { dataKey: 't_amb', color: '#8884d8', name: 'Spoljašnja temperatura' },
    { dataKey: 't_ref', color: '#82ca9d', name: 'Referentna temperatura' },
  ];

  const primaryAndSecondaryKeys = [
    { dataKey: 't_sup_prim', color: '#ff7300', name: 'Temperatura odvoda primarnog kruga' },
    { dataKey: 't_ret_prim', color: '#ff0000', name: 'Temperatura dovoda primarnog kruga' },
    { dataKey: 't_sup_sec', color: '#ffc658', name: 'Temperatura odvoda sekundarnog kruga' },
    { dataKey: 't_ret_sec', color: '#00ff00', name: 'Temperatura dovoda sekundarnog kruga' },
  ];

  return (
    <Container>
      <Navbar />
      <div className='content-cont'>
        <div className='c'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchTemperatureData();
        }}
        className="temperature-form"
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month']}
              label="Mesec i Godina"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  sx={{ input: { color: 'white' }, fieldset: { borderColor: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  backgroundColor: '#424242',
                  '& fieldset': {
                    borderColor: 'white', 
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white', 
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white', 
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white', 
                },
                '& .MuiSvgIcon-root': {
                  color: 'white', 
                },
                '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                  color: 'white', 
                },
              }}
            />

            </LocalizationProvider>
          </Grid>
          <Grid item>
          <TextField
            select
            label="Lokacija"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                backgroundColor: '#424242',
                '& fieldset': {
                  borderColor: 'white', 
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Boja okvira prilikom hover-a
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Boja okvira kada je fokusiran
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Boja labele
              },
              '& .MuiSelect-icon': {
                color: 'white', // Boja strelice
              },
            }}
            InputLabelProps={{ style: { color: 'white' } }}
          >
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <MenuItem key={index} value={location}>
                  {location}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>No locations available</MenuItem>
            )}
          </TextField>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2} className="charts-container">
        <Grid item xs={12} md={6}>
          <TemperatureLineChart data={data} lineKeys={ambientAndReferenceKeys} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TemperatureLineChart data={data} lineKeys={primaryAndSecondaryKeys} />
        </Grid>
      </Grid>
       </div>
      <Footer />
      </div>
    </Container>
  );
};

export default TemperaturePage;
