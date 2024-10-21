from datetime import date, datetime, time, timezone, timedelta
from sqlalchemy import Date, desc
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import pytz
from app.schema import AmbTemperatureLineChartResponse, AverageTemperatureResponse, Location, Measurement, MeasurementBase, PowerTemperatureData, PowerTemperatureResponse, PrimaryTemperatureLineChartResponse, TemperatureDataResponse, TemperatureDifferenceResponse, TemperatureLineChartResponse, TotalEnergyResponse
from . import model
from .database import get_db
from fastapi import HTTPException
from sqlalchemy.future import select

router = APIRouter()

@router.get("/measurements/", response_model=List[MeasurementBase])
async def read_measurements(
    date: Optional[datetime] = Query(None, description="Datum od kog želite merenja u formatu YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db)
):
    if date:
        selected_date = date.date()  
    else:
        selected_date = datetime.now().date()  

    start_date = datetime.combine(selected_date, datetime.min.time())
    end_date = datetime.combine(selected_date, datetime.max.time())

    query = select(model.Measurement).where(
        model.Measurement.datetime >= start_date,
        model.Measurement.datetime <= end_date
    )

    result = await db.execute(query)
    measurements = result.scalars().all()

    
    if not measurements:
        latest_date_query = select(model.Measurement.datetime).order_by(desc(model.Measurement.datetime)).limit(1)
        latest_result = await db.execute(latest_date_query)
        latest_date = latest_result.scalar()

        if latest_date:
            start_date = datetime.combine(latest_date.date(), datetime.min.time())
            end_date = datetime.combine(latest_date.date(), datetime.max.time())

            query = select(model.Measurement).where(
                model.Measurement.datetime >= start_date,
                model.Measurement.datetime <= end_date
            )
            result = await db.execute(query)
            measurements = result.scalars().all()

    if not measurements:
        raise HTTPException(status_code=404, detail="No measurements available")

    return [MeasurementBase.from_orm(m) for m in measurements]

@router.get("/measurements/location/{location_name}", response_model=List[MeasurementBase])
async def read_measurements_by_location(
    location_name: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(model.Measurement).where(model.Measurement.location == location_name)

    result = await db.execute(query)
    measurements = result.scalars().all()

    if not measurements:
        raise HTTPException(status_code=404, detail="No measurements available for the specified location")

    return [MeasurementBase.from_orm(m) for m in measurements]


#ukupna potrosena energija po lokacijama
@router.get("/total_energy/", response_model=TotalEnergyResponse)
async def total_energy(location: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(func.sum(model.Measurement.e))
        .where(model.Measurement.location == location)
    )
    total_energy_kwh = result.scalar() or 0  # (kWh)

    total_energy_mwh = round(total_energy_kwh / 1000, 2)  # MWh
    return TotalEnergyResponse(total_energy_mwh=total_energy_mwh)

#ukupna potrosena energija sistema
@router.get("/total_energy_all/", response_model=TotalEnergyResponse)
async def total_energy_all(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.sum(model.Measurement.e)))
    total_energy_kwh = result.scalar() or 0  # (kWh)

    total_energy_mwh = round(total_energy_kwh / 1000, 2)  # MWh
    return TotalEnergyResponse(total_energy_mwh=total_energy_mwh)

@router.get("/total_energy_last_7_days/", response_model=TotalEnergyResponse)
async def total_energy_last_7_days(db: AsyncSession = Depends(get_db)):
    today = datetime.now().date()
    start_date = datetime.combine(today - timedelta(days=7), datetime.min.time())
    end_date = datetime.combine(today, datetime.max.time())

    result = await db.execute(
        select(func.sum(model.Measurement.e))
        .where(model.Measurement.datetime >= start_date)
        .where(model.Measurement.datetime <= end_date)
    )
    total_energy_kwh = result.scalar() or 0  # kWh

    if total_energy_kwh == 0:
        latest_date_query = select(model.Measurement.datetime).order_by(desc(model.Measurement.datetime)).limit(1)
        latest_result = await db.execute(latest_date_query)
        latest_date = latest_result.scalar()

        if latest_date:
            latest_date = latest_date.date()
            start_date = datetime.combine(latest_date - timedelta(days=7), datetime.min.time())
            end_date = datetime.combine(latest_date, datetime.max.time())

            result = await db.execute(
                select(func.sum(model.Measurement.e))
                .where(model.Measurement.datetime >= start_date)
                .where(model.Measurement.datetime <= end_date)
            )
            total_energy_kwh = result.scalar() or 0  # kWh

    total_energy_mwh = round(total_energy_kwh / 1000, 2)  # MWh
    return TotalEnergyResponse(total_energy_mwh=total_energy_mwh)


#procentualni udeo potrosnje energije po lokacijama
@router.get("/energy_share/", response_model=float)
async def energy_share(location: str, db: AsyncSession = Depends(get_db)):
    result_location = await db.execute(
        select(func.sum(model.Measurement.e))
        .where(model.Measurement.location == location)
    )
    total_energy_location_kwh = result_location.scalar() or 0  # kWh
    
    result_total = await db.execute(select(func.sum(model.Measurement.e)))
    total_energy_all_kwh = result_total.scalar() or 0  # kWh

    if total_energy_all_kwh == 0:
        raise HTTPException(status_code=400, detail="No energy data available.")

    energy_share_percentage = (total_energy_location_kwh / total_energy_all_kwh) * 100
    
    return round(energy_share_percentage, 2)

#Line Chart - grafikon linija sa vremenskom osom (datetime) kao x-osom i temperaturama na y-osi. Različite linije će predstavljati spoljašnju temperaturu, referentnu temperaturu, primarne i sekundarne temperature sistema.
@router.get("/temperature_data/", response_model=List[MeasurementBase])
async def get_temperature_data(
    location: str, 
    month: int = None, 
    year: int = None, 
    db: AsyncSession = Depends(get_db)
):
    query = select(model.Measurement).where(model.Measurement.location == location)

    if month and year:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        query = query.where(model.Measurement.datetime >= start_date, model.Measurement.datetime < end_date)

    query = query.order_by(model.Measurement.datetime)

    result = await db.execute(query)
    measurements = result.scalars().all()
    
    return [MeasurementBase.from_orm(m) for m in measurements]

#Line chart - ambijentalna, t_sup_sec i t_ret_sec u vremenu
@router.get("/temperature_chart/", response_model=List[AmbTemperatureLineChartResponse])
async def get_temperature_chart(
    location: str, 
    start_date: str, 
    end_date: str, 
    db: AsyncSession = Depends(get_db)
):
    try:
        start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if end_date_dt <= start_date_dt:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    query = (
        select(
            model.Measurement.datetime, 
            model.Measurement.t_amb,       # Ambijentalna temperatura
            model.Measurement.t_ret_sec,   # Temperatura povratka u sekundarnom krugu
            model.Measurement.t_sup_sec    # Temperatura dovoda u sekundarnom krugu
        )
        .where(
            model.Measurement.location == location,
            model.Measurement.datetime >= start_date_dt,
            model.Measurement.datetime <= end_date_dt
        )
        .order_by(model.Measurement.datetime)
    )

    result = await db.execute(query)
    measurements = result.fetchall()

    return [
        TemperatureLineChartResponse(
            datetime=measurement.datetime,
            t_amb=measurement.t_amb,
            t_ret_sec=measurement.t_ret_sec,
            t_sup_sec=measurement.t_sup_sec  # Dodaj temperaturu dovoda u sekundarnom krugu
        )
        for measurement in measurements
    ]


#potrosnja energije po lokacijama na mesecnom nivou, za mesec koji korisnik izabere
@router.get("/monthly_energy_by_location/", response_model=TotalEnergyResponse)
async def monthly_energy_by_location(location: str, month: int, year: int, db: AsyncSession = Depends(get_db)):
    
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12.")
    
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    result = await db.execute(
        select(func.sum(model.Measurement.e))
        .where(
            model.Measurement.location == location,
            model.Measurement.datetime >= start_date,
            model.Measurement.datetime < end_date
        )
    )
    
    total_energy_kwh = result.scalar() or 0  # kWh

    total_energy_mwh = round(total_energy_kwh / 1000, 2)  # MWh

    return TotalEnergyResponse(location=location, total_energy_mwh=total_energy_mwh)


#Area Chart - Prikaz isporučene energije u odnosu na vreme
@router.get("/energy_over_time/", response_model=List[MeasurementBase])
async def energy_over_time(
    location: str,
    month: int,
    year: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if end_date <= start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    query = (
        select(model.Measurement)
        .where(
            model.Measurement.location == location,
            model.Measurement.datetime >= start_date,
            model.Measurement.datetime <= end_date
        )
        .order_by(model.Measurement.datetime)
    )

    result = await db.execute(query)
    measurements = result.scalars().all()

    return [MeasurementBase.from_orm(m) for m in measurements]

#Bar Chart -  Razlika između primarnih i sekundarnih temperatura - danasnja merenja
@router.get("/temperature_differences/", response_model=List[TemperatureDifferenceResponse])
async def get_temperature_differences(location: str, db: AsyncSession = Depends(get_db)):
    today = datetime.now().date()

    result_today = await db.execute(
        select(
            model.Measurement.datetime,
            model.Measurement.t_sup_prim,
            model.Measurement.t_sup_sec,
            model.Measurement.t_ret_prim,
            model.Measurement.t_ret_sec
        ).where(
            model.Measurement.location == location,
            func.date(model.Measurement.datetime) == today
        ).order_by(model.Measurement.datetime) 
    )
    measurements_today = result_today.fetchall()

    if not measurements_today:
        result_last_date = await db.execute(
            select(func.date(model.Measurement.datetime))
            .where(model.Measurement.location == location)
            .order_by(desc(model.Measurement.datetime))  
            .limit(1)
        )
        last_date = result_last_date.scalar()

        if not last_date:
            return []

        result_last_measurements = await db.execute(
            select(
                model.Measurement.datetime,
                model.Measurement.t_sup_prim,
                model.Measurement.t_sup_sec,
                model.Measurement.t_ret_prim,
                model.Measurement.t_ret_sec
            ).where(
                model.Measurement.location == location,
                func.date(model.Measurement.datetime) == last_date
            ).order_by(model.Measurement.datetime)  # Sortiramo po vremenu
        )
        measurements = result_last_measurements.fetchall()
    else:
        measurements = measurements_today

    # Izračunaj razlike u temperaturama
    temperature_differences = []
    for measurement in measurements:
        measurement_datetime, t_sup_prim, t_sup_sec, t_ret_prim, t_ret_sec = measurement

        sup_diff = None
        ret_diff = None

        if t_sup_prim is not None and t_sup_sec is not None:
            sup_diff = t_sup_prim - t_sup_sec

        if t_ret_prim is not None and t_ret_sec is not None:
            ret_diff = t_ret_prim - t_ret_sec

        temperature_differences.append(
            TemperatureDifferenceResponse(
                datetime=measurement_datetime,
                sup_diff=sup_diff,
                ret_diff=ret_diff
            )
        )

    return temperature_differences

#Line Chart - temperature dovoda i odvoda u sekundarnom krugu kroz vreme (danasnji dan, ukoliko merenja za danasnji dan nisu dostupna, onda merenja za poslednji dostupan dan)
@router.get("/secondary_temperature_line_chart/", response_model=List[TemperatureLineChartResponse])
async def get_secondary_temperature_line_chart(location: str, db: AsyncSession = Depends(get_db)):
    today = date.today()

    async def fetch_measurements_by_date(fetch_date):
        async with db.begin():
            result_measurements = await db.execute(
                select(model.Measurement)
                .where(
                    model.Measurement.location == location,
                    func.cast(model.Measurement.datetime, Date) == fetch_date 
                )
                .order_by(model.Measurement.datetime)
            )
        return result_measurements.scalars().all()

    measurements = await fetch_measurements_by_date(today)

    if not measurements:
        async with db.begin():  
            last_date_result = await db.execute(
                select(func.max(func.cast(model.Measurement.datetime, Date)))
                .where(model.Measurement.location == location)
            )
            last_available_date = last_date_result.scalar()

        if last_available_date is None:
            raise HTTPException(status_code=404, detail=f"No measurements found for location {location}.")

        measurements = await fetch_measurements_by_date(last_available_date)

    if not measurements:
        raise HTTPException(status_code=404, detail=f"No measurements available for location {location}.")

    temperature_values = [
        TemperatureLineChartResponse(
            datetime=measurement.datetime,
            t_sup_sec=measurement.t_sup_sec,
            t_ret_sec=measurement.t_ret_sec
        )
        for measurement in measurements
    ]

    return temperature_values

# Line Chart - temperature dovoda i odvoda u primarnom krugu kroz vreme (današnji dan, ili poslednji dostupan dan)
@router.get("/primary_temperature_line_chart/", response_model=List[PrimaryTemperatureLineChartResponse])
async def get_primary_temperature_line_chart(location: str, db: AsyncSession = Depends(get_db)):
    today = date.today()

    async def fetch_measurements_by_date(fetch_date):
        async with db.begin():
            result_measurements = await db.execute(
                select(model.Measurement)
                .where(
                    model.Measurement.location == location,
                    func.cast(model.Measurement.datetime, Date) == fetch_date 
                )
                .order_by(model.Measurement.datetime)
            )
        return result_measurements.scalars().all()

    measurements = await fetch_measurements_by_date(today)

    if not measurements:
        async with db.begin():  
            last_date_result = await db.execute(
                select(func.max(func.cast(model.Measurement.datetime, Date)))
                .where(model.Measurement.location == location)
            )
            last_available_date = last_date_result.scalar()

        if last_available_date is None:
            raise HTTPException(status_code=404, detail=f"No measurements found for location {location}.")

        measurements = await fetch_measurements_by_date(last_available_date)

    if not measurements:
        raise HTTPException(status_code=404, detail=f"No measurements available for location {location}.")

    temperature_values = [
        PrimaryTemperatureLineChartResponse(
            datetime=measurement.datetime,
            t_sup_prim=measurement.t_sup_prim,
            t_ret_prim=measurement.t_ret_prim
        )
        for measurement in measurements
    ]

    return temperature_values

#Line chart - ambijentalna temperatura za mesec koji korisnik odabere
@router.get("/ambient_temperature_chart/", response_model=List[AmbTemperatureLineChartResponse])
async def get_ambient_temperature_chart(
    location: str,
    month: int,
    year: int,
    db: AsyncSession = Depends(get_db)
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12.")
    
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    query = (
        select(
            model.Measurement.datetime,
            model.Measurement.t_amb  
        )
        .where(
            model.Measurement.location == location,
            model.Measurement.datetime >= start_date,
            model.Measurement.datetime < end_date
        )
        .order_by(model.Measurement.datetime)
    )
    
    result = await db.execute(query)
    measurements = result.fetchall()

    return [
        AmbTemperatureLineChartResponse(
            datetime=measurement.datetime,
            t_amb=measurement.t_amb
        )
        for measurement in measurements
    ]

@router.get("/temperature_data_by_location/", response_model=TemperatureDataResponse)
async def get_temperature_data_by_location(location: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(model.Measurement)
        .where(model.Measurement.location == location)
        .order_by(model.Measurement.datetime.desc())  
        .limit(1)  
    )
    measurement = result.scalar()  

    if measurement is None:
        raise HTTPException(status_code=404, detail="No measurement found for the given location")

    return TemperatureDataResponse(
        datetime=measurement.datetime,
        temperature=measurement.t_amb,
        location=measurement.location
    )

@router.get("/locations/")
async def get_locations(db: AsyncSession = Depends(get_db)):
    query = select(model.Measurement.location).distinct()
    result = await db.execute(query)
    locations = result.scalars().all()

    return locations





















