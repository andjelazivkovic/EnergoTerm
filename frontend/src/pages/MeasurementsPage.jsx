import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getMeasurementsByDate } from '../api/energoterm_api.jsx'; 
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress'; 
import dayjs from 'dayjs';

const MeasurementsPage = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDate) {
          setLoading(true);
          const dateString = selectedDate.format('YYYY-MM-DD');
          const data = await getMeasurementsByDate(dateString);
          setMeasurements(data);
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const columns = [
    { field: 'datetime', headerName: 'Datum', flex: 1 },
    { field: 'location', headerName: 'Lokacija', flex: 1 },
    { field: 't_amb', headerName: 'Spoljašnja temperatura (°C)', flex: 1 },
    { field: 't_ref', headerName: 'Referentna temperatura (°C)', flex: 1 },
    { field: 't_sup_prim', headerName: 'Temperatura dovoda primarnog kruga (°C)', flex: 1 },
    { field: 't_ret_prim', headerName: 'Temperatura odvoda primarnog kruga (°C)', flex: 1 },
    { field: 't_sup_sec', headerName: 'Temperatura dovoda sekundarnog kruga (°C)', flex: 1 },
    { field: 't_ret_sec', headerName: 'Temperatura dovoda sekundarnog kruga (°C)', flex: 1 },
    { field: 'e', headerName: 'Predata energija (kWh)', flex: 1 },
    { field: 'pe', headerName: 'Predata snaga (kW)', flex: 1 },
  ];

  return (
    <div>
      <Navbar />
      <Box 
        sx={{ 
          width: '100vw',
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          margin: 'auto',
          paddingTop: '80px',
          paddingBottom: '80px'
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Datum i Godina"
            value={selectedDate}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedDate(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
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
                  '& .MuiPickersDay-root': {
                    color: 'white',
                  },
                  '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: '#ff5722',
                  },
                  '& .MuiPickersDay-root.Mui-selected:hover': {
                    backgroundColor: '#ff5722',
                  },
                  '& .MuiTypography-root': {
                    color: 'white',
                  },
                  '& .MuiPickersDay-root.Mui-today': {
                    border: '2px solid #ff5722',
                  },
                  '& .MuiPickersDay-root:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  },
                }}
              />
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

        {loading ? (
          <CircularProgress sx={{ marginTop: '20px' }} />
        ) : (
          <DataGrid
          rows={measurements}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          pagination
          getRowId={(row) => `${row.datetime}-${row.location}`}
          sx={{
            width: '100%',
            marginTop: '20px',
            backgroundColor: '#424242', 
            color: 'white',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#333333',
              color: 'white', 
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#333333', 
              color: 'white', 
            },
            '& .MuiTablePagination-toolbar': {
              color: 'white', 
            },
            '& .MuiTablePagination-selectRoot, .MuiTablePagination-displayedRows': {
              color: 'white', 
            },
            '& .MuiTablePagination-actions button': {
              color: 'white',
            },
          }}
        />
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default MeasurementsPage;
