import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import PieChartIcon from '@mui/icons-material/PieChart';
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Avatar, Typography, CircularProgress } from '@mui/material';
import { getTotalEnergyAll, getTemperatureDataByLocation, getEnergyShare, getTotalEnergyLast7Days } from '../api/energoterm_api.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PieActiveArc from '../components/PieActiveArc';
import '../styles/Home.css';

const Home = () => {
  const [totalEnergy, setTotalEnergy] = useState(null);
  const [energyLast7Days, setEnergyLast7Days] = useState(null);
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [energyShareData, setEnergyShareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locations = ['TPS Lamela L4', 'TPS Lamela L8', 'TPS Lamela L12', 'TPS Lamela L17', 'TPS Lamela L22'];
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalEnergyResponse = await getTotalEnergyAll();
        const last7DaysEnergyResponse = await getTotalEnergyLast7Days();
        console.log(totalEnergyResponse);
        setTotalEnergy(totalEnergyResponse?.total_energy_mwh || 0);
        setEnergyLast7Days(last7DaysEnergyResponse?.total_energy_mwh || 0);

        const temperaturePromises = locations.map(async (location) => {
          try {
            return await getTemperatureDataByLocation(location);
          } catch (error) {
            console.error(`Error fetching temperature for ${location}:`, error);
            return { temperature: 'N/A' };
          }
        });

        const energySharePromises = locations.map(async (location) => {
          try {
            return await getEnergyShare(location);
          } catch (error) {
            console.error(`Error fetching energy share for ${location}:`, error);
            return 0;
          }
        });

        const temperatureResults = await Promise.all(temperaturePromises);
        const validTemperatures = temperatureResults
          .filter(temp => temp.temperature !== 'N/A')
          .map(temp => parseFloat(temp.temperature));

        if (validTemperatures.length > 0) {
          const totalTemperature = validTemperatures.reduce((sum, temp) => sum + temp, 0);
          const average = (totalTemperature / validTemperatures.length).toFixed(2);
          setAverageTemperature(average);
        } else {
          setAverageTemperature('N/A');
        }

        const energyShareResults = await Promise.all(energySharePromises);
        setEnergyShareData(energyShareResults.map((value, index) => ({
          name: locations[index],
          value,
          color: colors[index % colors.length],
        })));
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja podataka.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locations]);

  return (
    <div className="home-container">
      <Navbar />
      <div className="content-container">
        {loading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <>
            {error && (
              <Typography color="error" align="center" gutterBottom>
                {error}
              </Typography>
            )}

            <Grid container spacing={3} justifyContent="center" className="data-grid" marginTop="-8px">
              
              <Grid item xs={12} sm={4}>
                <Paper elevation={3} style={{ padding: '20px', display: 'flex', color:'white', alignItems: 'center', background:'#232324' }}>
                  <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '16px' }}>
                    <Typography variant="h6">E</Typography>
                  </Avatar>
                  <div>
                    <Typography variant="h6">Ukupna potrošnja energije sistema</Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold'}}>
                      {totalEnergy ? `${totalEnergy} MWh` : 'Nema podataka.'}
                    </Typography>
                  </div>
                </Paper>
              </Grid>

              {/* Nova kartica za potrošnju energije u poslednjih 7 dana */}
              <Grid item xs={12} sm={4}>
                <Paper elevation={3} style={{ padding: '20px', display: 'flex', color:'white', alignItems: 'center', background:'#232324' }}>
                  <Avatar style={{ backgroundColor: '#f57c00', marginRight: '16px' }}>
                    <Typography variant="h6">7D</Typography>
                  </Avatar>
                  <div>
                    <Typography variant="h6">Potrošnja energije sistema u poslednjih 7 dana</Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      {energyLast7Days ? `${energyLast7Days} MWh` : 'Nema podataka.'}
                    </Typography>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper elevation={3} style={{ padding: '20px', display: 'flex', color: 'white', alignItems: 'center', background: '#232324' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DeviceThermostatIcon style={{ fontSize: '2rem', marginRight: '16px', color: '#3f51b5' }} />
                    <div>
                    <Typography variant="h6">Današnja prosečna temperatura</Typography>
                      <Typography variant="h4" style={{ fontWeight: 'bold', color: '#fff' }}>
                        {averageTemperature !== 'N/A' ? `${averageTemperature}°C` : 'Nema podataka'}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>

            {/* Chart for energy share */}
            <div className="chart-container" style={{marginTop:'5px', padding: '40px 0', backgroundColor: '#1c1c1e', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
                  <PieChartIcon style={{ color: '#fff' }} />
                </Avatar>
                <Typography 
                  variant="h4" 
                  align="center" 
                  style={{ fontWeight: 'bold', color: '#fff' }}>
                  Udeo potrošnje energije po lokacijama
                </Typography>
              </div>
              {energyShareData.length > 0 ? (
                <div 
                  className="pie-chart" 
                  style={{ display: 'flex', justifyContent: 'center', padding: '10px', backgroundColor: '#2d2d30', borderRadius: '8px' }}>
                  <PieActiveArc data={energyShareData} />
                </div>
              ) : (
                <Typography 
                  variant="h6" 
                  align="center" 
                  style={{ color: '#f44336', fontStyle: 'italic', marginTop: '10px' }}>
                  Nema podataka o udelu potrošnje energije.
                </Typography>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
