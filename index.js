const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.post('/getClosestParking', (req, res) => {
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
            { id: 45, name: 'Frishman', lat: 32.0850036, long: 34.777608 }
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});