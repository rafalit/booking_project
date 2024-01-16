const express = require('express');
const app = express();

// Import konfiguracji bazy danych
const dbConfig = require('./db');

// Import modułów tras
const roomsRoute = require('./routes/roomRoute');
const userRoute = require('./routes/userRoute');
const bookingsRoute = require('./routes/bookingsRoute');

// Middleware dla danych w formacie JSON
app.use(express.json());

// Trasy dla poszczególnych endpointów
app.use('/api/rooms', roomsRoute);
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingsRoute);

// Konfiguracja portu serwera
const port = process.env.PORT || 5000;

// Uruchomienie serwera na określonym porcie
app.listen(port, () => console.log(`Server running on port ${port}`));
