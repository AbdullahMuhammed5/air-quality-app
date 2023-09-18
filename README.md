# Air Quality Monitoring App

This project is an Air Quality Monitoring App that provides real-time air quality data for cities. It includes an API for retrieving air quality information for the nearest city based on the provided coordinates, as well as the date and time of the most polluted conditions based on specific standards.

## Getting Started

Follow these instructions to set up and run the Air Quality Monitoring App on your local machine.

### Prerequisites

Before you begin, ensure you have the following software installed:

- Node.js (v14 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abdullahmuhammed5/air-quality-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd air-quality-app
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

### Configuration

You need to configure the application by creating a `.env` file in the project root. Use the `.env.example` file as a template and provide your configuration values, including MongoDB connection details and API keys.`

```bash
cp .env.example .env 
```

This app is using AQair as an external API to fetch the air quality data. So to get benefit of this app you need to create an account on [AQair Dashboard](https://www.iqair.com/fr/dashboard) to get an API key that will be replaced in the env var below. This API key will authorize you to call AQair APIs.

```
IQAIR_BASE_URL=https://api.airvisual.com
IQAIR_API_KEY={{YOUR_API_KEY}}
```

## Database

This app depend on connecting to Mongo Cloud Database, so you need to create one visit [here](https://cloud.mongodb.com/), create a database and get URL and the credentials to add them in the below .env vars. 

```
DATABASE_URL=
DATABASE_USER=
DATABASE_PASSWORD=
```

### Running the App

Start the application:

   ```bash
   npm start
   ```

The app will be running at `http://localhost:3000` as a default.

### Running Tests

To run the unit and integration tests for the app, use the following command:

```bash
npm test
```

Note: The integration tests are running on Mongo Memory Server.

## API Documentation

### Nearest City Pollution

Endpoint: `/api/v1/cities/nearest-city-pollution`

- **Method**: `GET`
- **Description**: Retrieves air quality data for the nearest city based on latitude and longitude coordinates.
- **Query Parameters**:
  - `lat` (required): Latitude of the location.
  - `long` (required): Longitude of the location.
- **Response**:
  - `Result`: Air quality data for the nearest city.

### Most Polluted Datetime

Endpoint: `/api/v1/cities/most-polluted-datetime`

- **Method**: `GET`
- **Description**: Retrieves from the Database the date and time of the most polluted conditions in a specified city based on a chosen air quality standard.
- **Query Parameters**:
  - `standard` (optional): Air quality standard, either 'US' or 'CN' (default is 'US').
  - `city` (required): Name of the city to query. The city name is case-insensitive.
- **Response**:
  - `Result`: Date and time of the most polluted conditions.
- Note: The cron job is feeding the database only with Paris city data, so the data will be return for Paris and other city will be empty. 

## Testing API

Please find the postman collection [here](./postman_collection.json) to test the APIs.

## Scheduled Cron Job

The application includes a scheduled cron job that that run every minute to updates air quality data for only Paris city. The cron job runs at regular intervals to ensure that the air quality information is up-to-date.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

