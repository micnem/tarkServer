# Parking Finder API

This is a Node.js application that provides an API to find the closest parking lot with available spaces based on the user's location.

## Features

- Fetches parking lot data and checks for availability.
- Calculates the trip duration to each parking lot using Google Maps API.
- Returns the closest available parking lot.

## Requirements

- Node.js
- Google Maps API Key
- Internet connection

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/micnem/tark_server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd tark_server
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your Google Maps API key:
   ```plaintext
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## Usage

1. Start the server:
   ```bash
   node index.js
   ```
2. Send a POST request to `http://localhost:8080/getClosestParking` with the user's location in the request body.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:michael.nemni@gmail.com).