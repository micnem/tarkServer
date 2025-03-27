const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.send({ status: 'ok' });
});

// Get all parking lots with their availability status
app.get('/getAllParkingLots', (req, res) => {
    console.log('getAllParkingLots started');
    async function getHasParking(lot) {
        const url = `https://ahuzot.co.il/Parking/ParkingDetails/?ID=${lot.id}`;
        const response = await fetch(url).then(res => res.text());
        const isEmpty = !response.includes('male.png');
        lot.isEmpty = isEmpty;
    }

    async function check() {
        const parkingLots = [
            { id: 123, name: 'Arlozorov 17', lat: 32.08750, long: 34.77380 },
            { id: 122, name: 'Assuta', lat: 32.08830, long: 34.77990 },
            { id: 3, name: 'Basel', lat: 32.09000, long: 34.78010 },
            { id: 45, name: 'Frishman', lat: 32.07969, long: 34.76917 }
        ];

        await Promise.all(parkingLots.map(lot => getHasParking(lot)));
        
        return parkingLots.map(lot => ({
            name: lot.name,
            isEmpty: lot.isEmpty,
            wazeUrl: `https://www.waze.com/ul?ll=${lot.lat},${lot.long}&navigate=yes`
        }));
    }

    check()
        .then(parkingInfo => {
            res.send({ message: 'Received', content: parkingInfo });
        })
        .catch(error => {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ message: 'Error', error: error.message });
        });
});

app.post('/getClosestParking', (req, res) => {
    console.log('getClosestParking startedå');
    async function getHasParking(lot) {
        const url = `https://ahuzot.co.il/Parking/ParkingDetails/?ID=${lot.id}`;
        const response = await fetch(url).then(res => res.text());
        const isEmpty = !response.includes('male.png');
        lot.isEmpty = isEmpty;
    }

    async function check() {
        const parkingLots = [
            { id: 123, name: 'Arlozorov 17', lat: 32.08750, long: 34.77380 },
            { id: 122, name: 'Assuta', lat: 32.08830, long: 34.77990 },
            { id: 3, name: 'Basel', lat: 32.09000, long: 34.78010 },
            { id: 45, name: 'Frishman', lat: 32.07969, long: 34.76917 }
        ];

        await Promise.all(parkingLots.map(lot => getHasParking(lot)));
        const availableLots = parkingLots.filter(lot => lot.isEmpty);

        if (!availableLots.length) {
            return null;
        }

        return availableLots.map(lot => ({
            title: `Parking available at ${lot.name}`,
            wazeUrl: `https://www.waze.com/ul?ll=${lot.lat},${lot.long}&navigate=yes`
        }));
    }

    check()
        .then(parkingInfo => {
            res.send({ message: 'Received', content: parkingInfo });
        })
        .catch(error => {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ message: 'Error', error: error.message });
        });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

// Handle 404s
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server mic is running on port ${port}`);
});