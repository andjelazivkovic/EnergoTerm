
export const getTotalEnergyAll = async () => {
  const response = await fetch('http://127.0.0.1:8000/total_energy_all');
  return response.json();
};

  
  export const getLocations= async () => {
    const response= await fetch('http://127.0.0.1:8000/locations/');
    return response.json();
  }


  export const getTemperatureDataByLocation = async (location) => {
    const response = await fetch(`http://127.0.0.1:8000/temperature_data_by_location/?location=${location}`);
    return response.json();
  };

  export const getTotalEnergyLast7Days = async () => {
    const response = await fetch('http://127.0.0.1:8000/total_energy_last_7_days/');
    if (!response.ok) {
      throw new Error('Failed to fetch energy consumption for the last 7 days');
    }
    return response.json();
  };
  
  

  export const getEnergyShare = async (location) => {
    const response = await fetch(`http://127.0.0.1:8000/energy_share/?location=${location}`);
    return response.json();
  };


export const registerUser = async (email, password) => {
  const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  });
  return response.json();
};


export const loginUser = async (email, password) => {
  const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
  });
  return response.json();
};


export const logoutUser = async (idToken) => {
  const response = await fetch('http://127.0.0.1:8000/logout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'id-token': idToken, 
      },
  });
  return response.json();
};

export const changeUserPassword = async (uid, newPassword) => {
  const response = await fetch('http://127.0.0.1:8000/change-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, new_password: newPassword }), 
  });
  return response.json();
};


export const getMeasurementsByDate = async (date) => {
  const response = await fetch(`http://127.0.0.1:8000/measurements/?date=${date}`);
  if (!response.ok) {
      throw new Error('Failed to fetch measurements');
  }
  return response.json();
};

export const getMonthlyEnergyByLocation = async (location, month, year) => {
  const response = await fetch(`http://127.0.0.1:8000/monthly_energy_by_location/?location=${location}&month=${month}&year=${year}`);
  if (!response.ok) {
      throw new Error('Failed to fetch energy consumption by location');
  }
  return response.json();
};

export const getEnergyOverTime = async (location, month, year) => {
  const response = await fetch(`http://127.0.0.1:8000/energy_over_time/?location=${location}&month=${month}&year=${year}`);
  if (!response.ok) {
      throw new Error('Failed to fetch energy data over time');
  }
  return response.json();
};

export const getTemperatureData = async (location, month, year) => {
  const response = await fetch(`http://127.0.0.1:8000/temperature_data/?location=${location}&month=${month}&year=${year}`);
  if (!response.ok) {
      throw new Error('Failed to fetch temperature data');
  }
  return response.json();
};
  

export const getSecondaryTemperatureData = async (location) => {
  const response = await fetch(`http://127.0.0.1:8000/secondary_temperature_line_chart/?location=${location}`);
  if (!response.ok) {
      throw new Error('Failed to fetch secondary temperature data');
  }
  return response.json();
};


export const getPrimaryTemperatureData = async (location) => {
  const response = await fetch(`http://127.0.0.1:8000/primary_temperature_line_chart/?location=${location}`);
  if (!response.ok) {
      throw new Error('Failed to fetch primary temperature data');
  }
  return response.json();
};
