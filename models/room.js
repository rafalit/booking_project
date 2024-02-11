const mongoose = require("mongoose");

// Definicja schematu danych dla pokoju
const roomSchema = mongoose.Schema({
    // Nazwa pokoju
    name: {
        type: String,
        required: true
    },
    // Maksymalna liczba osób w pokoju
    maxcount: {
        type: Number,
        required: true
    },
    // Numer telefonu do pokoju
    phoneNumber: {
        type: String,
        required: true
    },
    // Opłata za wynajem pokoju za dzień
    renpertday: {
        type: Number,
        required: true
    },
    // URL do obrazków pokoju (może być tablicą dla wielu obrazków)
    imageurl: {
        type: [],
        required: true
    },
    // Aktualne rezerwacje pokoju (może być tablicą dla wielu rezerwacji)
    currentbookings: {
        type: [],
        required: true
    },
    // Rodzaj pokoju
    type: {
        type: String,
        required: true
    },
    // Opis pokoju
    description: {
        type: String,
        required: true
    },
}, {
    // Opcje, w tym ustawienie automatycznego generowania znaczników czasu
    timestamps: true,
    // Nazwa kolekcji w bazie danych (opcjonalne)
    collection: 'pokoiki'
});

// Tworzenie modelu 'Room' na podstawie zdefiniowanego schematu
const Room = mongoose.model('Room', roomSchema);

async function clearCurrentBookings() {
  try {
    const result = await Room.updateMany({}, { $set: { currentbookings: [] } });
    console.log(`Zaktualizowano ${result.nModified} rekordów.`);
  } catch (error) {
    console.error("Błąd podczas aktualizacji rekordów:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Wywołaj funkcję do wyczyszczenia pola currentbookings dla wszystkich pokoi
//clearCurrentBookings();


// Eksportowanie modelu 'Room' do użycia w innych częściach aplikacji
module.exports = Room;
