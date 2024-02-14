import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [duplicateRooms, setDuplicateRooms] = useState([]);

  const [searchkey, setsearchkey] = useState('');
  const [type, settype] = useState('all');


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data || {};
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    try {
      if (!dates || dates.length !== 2) {
        handleDateClear(); // Handle date clearing
        return;
      }
  
      const fromDate = dates[0].format('DD-MM-YYYY');
      const toDate = dates[1].format('DD-MM-YYYY');
  
      setFromDate(fromDate);
      setToDate(toDate);
  
      const tempRooms = filterRoomsByTypeAndSearch(duplicateRooms);
      const filteredRooms = tempRooms.filter((room) => {
        // Assume the room is available unless a booking conflict is found
        let availability = true;
  
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            // Check if the new date range overlaps with any existing booking
            if (
              moment(fromDate, 'DD-MM-YYYY') <= moment(booking.toDate, 'DD-MM-YYYY') &&
              moment(toDate, 'DD-MM-YYYY') >= moment(booking.fromDate, 'DD-MM-YYYY')
            ) {
              // If there is an overlap, the room is not available
              availability = false;
              break;
            }
          }
        }
  
        return availability && room.name.toLowerCase().includes(searchkey.toLowerCase()) &&
          (type === 'all' || room.voivodeship.toLowerCase() === type.toLowerCase());
      });
  
      setRooms(filteredRooms);
    } catch (error) {
      handleDateClear(); // Handle date clearing
    }
  }

  function handleDateClear() {
    // Handle the case when (x) is clicked in the date picker
    setFromDate(null);
    setToDate(null);
    setRooms(duplicateRooms); // Reset to all rooms
  }

  function filterBySearch() {
    const tempRooms = filterRoomsByTypeAndDate(duplicateRooms);
    const filteredRooms = tempRooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setRooms(filteredRooms);
  }

  function filterByType(e) {
    const selectedType = e.target.value;
    settype(selectedType);

    const tempRooms = filterRoomsByDateAndSearch(duplicateRooms);

    if (selectedType === 'all') {
      setRooms(tempRooms);
    } else {
      const filteredRooms = tempRooms.filter(
        (room) => room.voivodeship.toLowerCase() === selectedType.toLowerCase()
      );
      setRooms(filteredRooms);
    }
  }

  function filterRoomsByDateAndSearch(roomsToFilter) {
    const tempRooms = roomsToFilter.filter((room) => {
      if (fromDate && toDate) {
        for (const booking of room.currentbookings) {
          if (
            moment(fromDate, 'DD-MM-YYYY') <= moment(booking.toDate, 'DD-MM-YYYY') &&
            moment(toDate, 'DD-MM-YYYY') >= moment(booking.fromDate, 'DD-MM-YYYY')
          ) {
            return false;
          }
        }
      }

      if (searchkey) {
        return room.name.toLowerCase().includes(searchkey.toLowerCase());
      }

      return true;
    });

    return tempRooms;
  }

  function filterRoomsByTypeAndDate(roomsToFilter) {
    const tempRooms = roomsToFilter.filter((room) => {
      if (fromDate && toDate) {
        for (const booking of room.currentbookings) {
          if (
            moment(fromDate, 'DD-MM-YYYY') <= moment(booking.toDate, 'DD-MM-YYYY') &&
            moment(toDate, 'DD-MM-YYYY') >= moment(booking.fromDate, 'DD-MM-YYYY')
          ) {
            return false;
          }
        }
      }

      if (type !== 'all' && room.voivodeship.toLowerCase() !== type.toLowerCase()) {
        return false;
      }

      return true;
    });

    return tempRooms;
  }

  function filterRoomsByTypeAndSearch(roomsToFilter) {
    const tempRooms = roomsToFilter.filter((room) => {
      if (searchkey) {
        return room.name.toLowerCase().includes(searchkey.toLowerCase());
      }

      if (type !== 'all' && room.voivodeship.toLowerCase() !== type.toLowerCase()) {
        return false;
      }

      return true;
    });

    return tempRooms;
  }

  return (
    <div className="container">
      <div className="row mt-3 bs justify-content-center">
        <div className="col-md-4 mt-2">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} onClear={handleDateClear} />
        </div>

        <div className="col-md-4 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>

        <div className="col-md-4 mt-3 text-center">
          <select className="form-control" value={type} onChange={filterByType}>
            <option value="all">All</option>
            <option value="Dolnośląskie">Dolnośląskie</option>
            <option value="Kujawsko-Pomorskie">Kujawsko-Pomorskie</option>
            <option value="Lubelskie">Lubelskie</option>
            <option value="Lubuskie">Lubuskie</option>
            <option value="Łódzkie">Łódzkie</option>
            <option value="Małopolskie">Małopolskie</option>
            <option value="Mazowieckie">Mazowieckie</option>
            <option value="Opolskie">Opolskie</option>
            <option value="Podkarpackie">Podkarpackie</option>
            <option value="Podlaskie">Podlaskie</option>
            <option value="Pomorskie">Pomorskie</option>
            <option value="Śląskie">Śląskie</option>
            <option value="Świętokrzyskie">Świętokrzyskie</option>
            <option value="Warmińsko-Mazurskie">Warmińsko-Mazurskie</option>
            <option value="Wielkopolskie">Wielkopolskie</option>
            <option value="Zachodnio-Pomorskie">Zachodnio-Pomorskie</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : error ? (
          <h1>
            <Error />
          </h1>
        ) : (
          <div>
            {rooms.map((room) => (
              <div key={room._id} className="col-md-9">
                <Room room={room} fromDate={fromDate} toDate={toDate} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homescreen;
