import React, { useEffect, useState } from 'react';
import BarChartComponent from '../components/BarChart.jsx';
import AreaChartComponent from '../components/AreaChart.jsx';
import { getLocations, getMonthlyEnergyByLocation, getEnergyOverTime } from '../api/energoterm_api.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Typography } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl, TextField, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { AccessAlarm } from '@mui/icons-material';
import '../styles/EnergyChartsPage.css';
import OfflineBoltSharpIcon from '@mui/icons-material/OfflineBoltSharp';

const EnergyChartsPage = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('TPS Lamela L22');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [barChartData, setBarChartData] = useState([]);
    const [areaChartData, setAreaChartData] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(data);
            } catch (error) {
                console.error('Failed to fetch locations:', error);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        const fetchBarChartData = async () => {
            if (locations.length > 0 && selectedDate) {
                try {
                    const month = selectedDate.month() + 1;
                    const year = selectedDate.year();
                    const barData = await Promise.all(
                        locations.map(async (location) => {
                            const energyData = await getMonthlyEnergyByLocation(location, month, year);
                            return {
                                location,
                                total_energy_mwh: energyData.total_energy_mwh || 0,
                            };
                        })
                    );
                    setBarChartData(barData);
                } catch (error) {
                    console.error('Error fetching bar chart data:', error);
                }
            }
        };
        fetchBarChartData();
    }, [locations, selectedDate]);

    useEffect(() => {
        const fetchAreaChartData = async () => {
            if (selectedLocation && selectedDate) {
                try {
                    const month = selectedDate.month() + 1;
                    const year = selectedDate.year();
                    const areaData = await getEnergyOverTime(selectedLocation, month, year);

                    if (areaData.length === 0) {
                        setAreaChartData([{ datetime: selectedDate.format(), e: 0 }]);
                    } else {
                        setAreaChartData(areaData);
                    }
                } catch (error) {
                    console.error('Error fetching area chart data:', error);
                }
            }
        };
        fetchAreaChartData();
    }, [selectedLocation, selectedDate]);

    return (
        <div className="page-container">
            <Navbar />
            <div className="content">
                <div style={{marginTop:'1px', marginBottom:'-30px'}}>
                <Typography variant="h6" style={{ color: 'white', paddingBottom: '50px', paddingTop: '80px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <OfflineBoltSharpIcon style={{ fontSize: '2rem', marginRight: '16px', color: '#d9bc04', marginBottom: '-10px' }} /> Analiza Potrošnje Energije
                </Typography>
                </div>
                <div className="form-row">
                    <div className="form-container">
                        <FormControl variant="outlined" sx={{
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
                            <InputLabel style={{ color: 'white' }}>Lokacija</InputLabel>
                            <Select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                label="Location"
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
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>{location}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={['year', 'month']}
                                label="Mesec i Godina"
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
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
                                    '& input': {
                                        color: 'white', 
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'white', 
                                    },
                                    '&.Mui-focused .MuiInputLabel-root': {
                                        color: 'white',
                                    },
                                    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                                color: 'white',
                                },
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                </div>

                <div className="charts-row">
                    {barChartData.length > 0 && (
                        <BarChartComponent width="100%" height={300} data={barChartData} selectedMonth={selectedDate.month() + 1} />
                    )}

                    {areaChartData.length > 0 && (
                        <AreaChartComponent width="100%" height={300} data={areaChartData} selectedMonth={selectedDate.month() + 1} />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EnergyChartsPage;
