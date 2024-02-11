import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

// Komponent Bookingscreen
function Bookingscreen() {
  const { roomid, fromDate, toDate } = useParams();
  const [room, setRoom] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalDays, setTotalDays] = useState(0);
  const [totalamount, setTotalamount] = useState();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Efekt pobierający dane o pokoju po zamontowaniu komponentu
  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setLoading(true);

        // Pobranie danych o pokoju z serwera za pomocą zapytania POST
        const response = await axios.post("/api/rooms/getroombyid", { roomid });
        const data = response.data;

        setRoom(data);
        setTotalDays(moment(toDate, "DD-MM-YYYY").diff(moment(fromDate, "DD-MM-YYYY"), "days") + 1);
        setTotalamount(data.renpertday * totalDays);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError(true);
        setLoading(false);
      }
    };

    // Wywołanie funkcji fetchRoomById
    fetchRoomById();
  }, [roomid, fromDate, toDate, totalDays]);

  // Funkcja obliczająca całkowitą cenę rezerwacji
  const calculateTotalPrice = (totalDays) => {
    return totalDays * room.renpertday;
  };

  // Funkcja obsługująca rezerwację pokoju
  async function bookRoom() {

    if (buttonClicked) {
      return; // Jeśli tak, nie wykonuj nic
    }

    setButtonClicked(true);

    const bookingDetails = {
      room: {
        name: room.name,
        _id: room._id,
      },
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromDate,
      toDate,
      totalamount: calculateTotalPrice(totalDays),
      totalDays,
      transactionid: 'xyz123',
    };

    try {
      // Wysłanie zapytania POST do endpointa odpowiedzialnego za rezerwację pokoju
      await axios.post('/api/bookings/bookroom', bookingDetails);
      setReservationSuccess(true);
      // Obsługa sukcesu, np. wyświetlenie komunikatu o sukcesie lub przekierowanie na stronę rezerwacji
    } catch (error) {
      console.error("Error booking room:", error);

      // Handle errors as needed
    }
  }

  return (
    <div>
      {/* Część komponentu do wyświetlania szczegółów pokoju */}
      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : error ? (
        <h1>
          <Error />
        </h1>
      ) : (
        <div className="row">
          <div className="col-md-5">
            <h1>{room.name}</h1>
            <img src={room.imageurl[0]} className="bigimg" alt={room.name} />
          </div>

          <div className="col-md-5">
            <h1>Szczegóły zamówienia</h1>
            <hr />
            <b>
              <p>Nazwa: {room.name}</p>
              <p>Pobyt od: {fromDate}</p>
              <p>Pobyt do: {toDate}</p>
              <p>Dla {room.maxcount} osób </p>
            </b>

            <div>
              <b>
                <h1>Cena</h1>
                <hr />
                <p>Ilość dni: {totalDays}</p>
                <p>Cena za noc: {room.renpertday}</p>
                <p>Całość: {calculateTotalPrice(totalDays)}</p>
              </b>
            </div>

                <div>
                  {/* Przycisk rezerwacji pokoju */}
                  <button className="btn btn-primary" onClick={bookRoom} disabled={buttonClicked}>
                      Zamów
                  </button>
                </div>

                {/* Warunek dla sukcesu rezerwacji */}
                {reservationSuccess && (
                  <div>
                    <h1 style={{ color: 'green' }}>Rezerwacja zakończona sukcesem!</h1>
                    {/* Dodatkowe informacje lub przekierowanie, jeśli to jest wymagane */}
                  </div>
                )}
              </div>
        </div>
      )}
    </div>
  );
}

// Eksportuje komponent Bookingscreen do użycia w innych częściach aplikacji
export default Bookingscreen;