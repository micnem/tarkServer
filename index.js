const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 3000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/getClosestParking', (req, res) => {
    console.log(req.body);
    const userLocation = req.body;
    async function getTripDuration(originCoordinates, lot) {

        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json\?origin=${originCoordinates.latitude},${originCoordinates.longitude}\&destination=${lot.lat},${lot.long}\&key\=${process.env.GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url).then(res => res.text());
            const tripDuration = JSON.parse(response).routes[0].legs[0].duration;
            return { ...lot, tripDuration };
        } catch (error) {
            return null;
        }
    }

    async function getHasParking(lot) {
        const url = `https://ahuzot.co.il/Parking/ParkingDetails/?ID=${lot.id}`;

        const response = await fetch(url).then(res => res.text());
        const isEmpty = !response.includes('male.png');
        lot.isEmpty = isEmpty;
    }

    async function check(userLocation) {
        const parkingLots = [{ id: 123, name: 'Arlozorov 17', lat: 32.08750, long: 34.77380 }, { id: 122, name: 'Assuta', lat: 32.08830, long: 34.77990 }, { id: 3, name: 'Basel', lat: 32.09000, long: 34.78010 }, { id: 131, name: 'Remez Arlozorov', lat: 32.08560, long: 34.78570 }];


        await Promise.all(parkingLots.map(lot => getHasParking(lot)));
        const placesWithParking = parkingLots.filter(lot => lot.isEmpty);

        if (!placesWithParking.length) {
            console.log('No parking :(');

            return;
        }
        const placesWithParkingAndDuration = await Promise.all(placesWithParking.map(lot => getTripDuration(userLocation, lot)));
        const closestParking = placesWithParkingAndDuration.reduce((prev, current) => {
            return prev.tripDuration.value < current.tripDuration.value ? prev : current;
        });


        const title = `Parking at ${closestParking.name}, a ${closestParking.tripDuration.text} drive away`;
        return { title, wazeUrl: `waze://?ll=${closestParking.lat},${closestParking.long}&navigate=yes` };
    }
    check(userLocation).then(parkingInfo => {
        res.send({ message: 'Received', content: parkingInfo });
    }).catch(error => {
        res.status(500).send({ message: 'Error', error: error.message });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});