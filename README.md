# EnergoTerm Project

**EnergoTerm** is an application for monitoring energy parameters based on modern technologies **FastAPI** and **React**. 
The project is containerized and consists of three services: backend (FastAPI), frontend (React), and a database (PostgreSQL). 
Additionally, it uses **Firebase** for authentication and authorization.

## Running the Project

Commands for working with the project:
- **Start**: `docker-compose up`
- **Stop**: `docker-compose down`
- **Rebuild**: `docker-compose up --build`

### Prerequisites

- **Docker** and **Docker Compose** must be installed.
- A **Firebase account** is required for user authentication.

### Setting Up Firebase Authentication

1. Log in to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. In the "Project Settings" section, create a new **Service Account** and download the JSON file containing the project information.
4. Place the JSON file in the appropriate location in the project (e.g., `backend/config/firebase.json`).
5. In the `docker-compose.yml` file, change the path to the Firebase JSON file so that the backend can access it.
6. In the `.env` file for the backend, set the corresponding API key and other details according to your Firebase account.

### Docker Compose File Structure

The `docker-compose.yml` includes the following services:

- **backend**: FastAPI application.
- **frontend**: React application.
- **db**: PostgreSQL database named `EnergoTerm`.

Thanks to Docker, all dependencies will be automatically installed when you start the project. The `docker-compose` command pulls all necessary images and sets up the environment as specified in the `docker-compose.yml` file, ensuring that everything runs smoothly.

### Importing Data into the Database

The database contains the `measurement` table, which holds data from a CSV file that should be imported upon first startup.

The CSV file must be placed in the folder `data/_data__202405241050` for Docker to load it during database creation.

1. Connect to the PostgreSQL container: 
    ```bash
    docker exec -it energoterm-db-1 psql -U postgres
    ```
2. Once inside the PostgreSQL interface, switch to the `EnergoTerm` database:
    ```sql
    \c EnergoTerm
    ```
3. Create the `measurement` table:
    ```sql
    CREATE TABLE public."measurement" (
        datetime timestamp NOT NULL,
        "location" varchar NOT NULL,
        t_amb float8 NULL,
        t_ref float8 NULL,
        t_sup_prim float8 NULL,
        t_ret_prim float8 NULL,
        t_sup_sec float8 NULL,
        t_ret_sec float8 NULL,
        e float8 NULL,
        pe float8 NULL,
        CONSTRAINT data_pkey PRIMARY KEY (datetime, location)
    );
    ```
4. Import data from the CSV file:
    ```sql
    \COPY public.measurement FROM '/data/_data__202405241050.csv' DELIMITER ',' CSV HEADER;
    ```
5. Exit the PostgreSQL session:
    ```sql
    \q
    ```
6. To stop the containers:
    ```bash
    docker-compose down
    ```
7. To restart the containers and rebuild (to ensure all packages are retrieved):
    ```bash
    docker-compose up --build
    ```

## Additional Notes

By using Docker, you can ensure that the application runs in a consistent environment across different machines. The containerization process manages the installation of all necessary dependencies, making it easier to get started with the project.

For any further questions or issues, feel free to reach out.
