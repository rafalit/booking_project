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

  const [fromDate, setfromdate] = useState();
  const [toDate, settodate] = useState();

  const [duplicaterooms, setduplicaterooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data || {};
        setRooms(data);
        setduplicaterooms(data);
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
    if (!dates || dates.length !== 2) {
      console.error("Invalid dates array:", dates);
      return;
    }
  
    const fromDate = dates[0].format("DD-MM-YYYY");
    const toDate = dates[1].format("DD-MM-YYYY");
  
    setfromdate(fromDate);
    settodate(toDate);
  
    const tempRooms = duplicaterooms.filter((room) => {
      // Assume the room is available unless a booking conflict is found
      let availability = true;
  
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          // Check if the new date range overlaps with any existing booking
          if (
            moment(fromDate, "DD-MM-YYYY") <= moment(booking.toDate, "DD-MM-YYYY") &&
            moment(toDate, "DD-MM-YYYY") >= moment(booking.fromDate, "DD-MM-YYYY")
          ) {
            // If there is an overlap, the room is not available
            availability = false;
            break;
          }
        }
      }
  
      return availability;
    });
  
    setRooms(tempRooms);
  }
  
  
  
  
  return (
    <div className='container'>
      <div className="row justify-content-center ml-5">
        <div className="col-md-5 mt-5">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate}/>
        </div>
        {loading ? (
          <h1><Loader/></h1>
        ) : error ? (
          <h1><Error/></h1>
        ) : (
          <div>
            {rooms.map((room) => (
              <div key={room._id} className="col-md-9">
                <Room room={room} fromDate={fromDate} toDate={toDate}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homescreen;