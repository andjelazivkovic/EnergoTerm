from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from typing import List, Tuple

class MeasurementBase(BaseModel):
    datetime: datetime
    location: str
    t_amb: Optional[float] = None
    t_ref: Optional[float] = None
    t_sup_prim: Optional[float] = None
    t_ret_prim: Optional[float] = None
    t_sup_sec: Optional[float] = None
    t_ret_sec: Optional[float] = None
    e: Optional[float] = None
    pe: Optional[float] = None

    class Config:
        from_attributes = True

class MeasurementCreate(MeasurementBase):
    datetime: datetime

class Measurement(MeasurementBase):
    datetime: datetime

    class Config:
        from_attributes = True

class TotalEnergyResponse(BaseModel):
    total_energy_mwh: float

class AverageTemperatureResponse(BaseModel):
    average_temperature: float

class PowerTemperatureData(BaseModel):
    datetime: datetime
    pe: float
    t_amb: Optional[float] = None
    t_ref: Optional[float] = None

    class Config:
        from_attributes = True

class PowerTemperatureResponse(BaseModel):
    data: List[PowerTemperatureData]

    class Config:
        from_attributes = True

class TemperatureDifferenceResponse(BaseModel):
    datetime: datetime
    sup_diff: Optional[float] = None  
    ret_diff: Optional[float] = None  

    class Config:
        from_attributes = True

class TemperatureLineChartResponse(BaseModel):
    datetime: datetime
    t_sup_sec: Optional[float]  
    t_ret_sec: Optional[float]  
    class Config:
        from_attributes = True

class AmbTemperatureLineChartResponse(BaseModel):
    datetime: datetime
    t_amb: Optional[float] = None  
    t_ret_sec: Optional[float] = None  
    t_sup_sec: Optional[float] = None  

    class Config:
        from_attributes = True

class PrimaryTemperatureLineChartResponse(BaseModel):
    datetime: datetime
    t_sup_prim: Optional[float]  
    t_ret_prim: Optional[float]  

    class Config:
        from_attributes = True

class TemperatureDataResponse(BaseModel):
    datetime: datetime
    temperature: float
    location: str

    class Config:
        from_attributes = True

class Location(BaseModel):
    location: str

    class Config:
        from_attributes = True




