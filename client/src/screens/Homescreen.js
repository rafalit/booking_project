import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
const { RangePicker } = DatePicker;

// Komponent Homescreen
function Homescreen() {
  // Stany do przechowywania danych o pokojach, informacji o stanie ładowania i błędzie
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Stany do przechowywania daty początkowej i końcowej wybranego zakresu dat
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  // Efekt pobierający dane o pokojach po zamontowaniu komponentu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Pobranie danych o pokojach z serwera za pomocą zapytania GET
        const data = (await axios.get('/api/rooms/getallrooms')).data || {};
        console.log("Data from server:", data);
        setRooms(data);
      } catch (error) {
        setError(true);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Wywołanie funkcji fetchData
    fetchData();
  }, []);

  // Funkcja filtrująca pokoje na podstawie wybranego zakresu dat
  function filterByDate(dates) {
    setFromDate(dates[0].format('DD-MM-YYYY'));
    setToDate(dates[1].format('DD-MM-YYYY'));
  }

  return (
    <div className='container'>
      <div className="row justify-content-center ml-5">
        <div className="col-md-5 mt-5">
          {/* Komponent RangePicker z biblioteki Ant Design do wybierania zakresu dat */}
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
        {loading ? (
          <h1><Loader /></h1>
        ) : error ? (
          <h1><Error /></h1>
        ) : (
          <div>
            {/* Mapowanie po wszystkich pokojach i renderowanie komponentu Room */}
            {rooms.map((room) => (
              <div key={room._id} className="col-md-9">
                {/* Przekazanie danych o pokoju i zakresie dat do komponentu Room */}
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Eksport komponentu Homescreen do użycia w innych częściach aplikacji
export default Homescreen;
