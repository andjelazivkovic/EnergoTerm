CREATE TABLE IF NOT EXISTS public.measurement (
    datetime TIMESTAMP NOT NULL,
    location VARCHAR NOT NULL,
    t_amb FLOAT8,
    t_ref FLOAT8,
    t_sup_prim FLOAT8,
    t_ret_prim FLOAT8,
    t_sup_sec FLOAT8,
    t_ret_sec FLOAT8,
    e FLOAT8,
    pe FLOAT8,
    PRIMARY KEY (datetime, location)
);
