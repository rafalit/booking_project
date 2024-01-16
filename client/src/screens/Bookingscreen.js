import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

// Komponent Bookingscreen
function Bookingscreen() {
  // Pobranie parametrów z adresu URL za pomocą hooka useParams
  const { roomid, fromDate, toDate } = useParams();

  // Stany do przechowywania danych o pokoju, informacji o błędzie oraz stanu ładowania
  const [room, setRoom] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalamount, setTotalamount] = useState();

  // Obliczenie całkowitej liczby dni między datą od a datą do
  const totalDays = moment(toDate, "DD-MM-YYYY").diff(
    moment(fromDate, "DD-MM-YYYY"),
    "days"
  );

  // Efekt pobierający dane o pokoju po zamontowaniu komponentu
  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setLoading(true);
        // Pobranie danych o pokoju z serwera za pomocą zapytania POST
        const data = (await axios.post("/api/rooms/getroombyid", { roomid })).data;
        setTotalamount(data.renpertday * totalDays);
        setRoom(data);
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
    };

    try {
      // Wysłanie zapytania POST do endpointa odpowiedzialnego za rezerwację pokoju
      await axios.post('/api/bookings/bookroom', bookingDetails);
      // Obsługa sukcesu, np. wyświetlenie komunikatu o sukcesie lub przekierowanie na stronę rezerwacji
    } catch (error) {
      console.error("Error booking room:", error);

      if (error.response) {
        // Obsługa błędów HTTP

        if (error.response.status === 400) {
          // Obsługa konkretnych scenariuszy błędu 400 Bad Request
          console.error("Bad Request. Details:", error.response.data);

          // Wyświetlenie użytkownikowi przyjaznej wiadomości o błędzie
          // Możesz dostosować to w zależności od konkretnych błędów walidacji
          alert("Invalid booking request. Please check your input.");
        } else {
          // Obsługa innych scenariuszy błędów
          console.error("Error response:", error.response.status, error.response.data);
          alert("An error occurred while processing your request.");
        }
      } else if (error.request) {
        // Obsługa sytuacji, gdy żądanie zostało wykonane, ale nie otrzymano odpowiedzi
        console.error("No response received. The request was made but no response was received.");
        alert("No response received. Please try again later.");
      } else {
        // Obsługa innych rodzajów błędów
        console.error("Error setting up the request:", error.message);
        alert("An unexpected error occurred. Please try again later.");
      }

      // Obsługa błędu, np. wyświetlenie komunikatu o błędzie
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
              <button className="btn btn-primary" onClick={bookRoom}>Zamów</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Eksportuje komponent Bookingscreen do użycia w innych częściach aplikacji
export default Bookingscreen;
