import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { DatePicker } from 'antd';
import { set } from 'mongoose';
import 'antd/dist/reset.css';
const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

    fetchData();
  }, []);

  function filterByDate(dates) {
 
    setFromDate((dates[0]).format('DD-MM-YYYY'));
    setToDate((dates[1]).format('DD-MM-YYYY'));
    
  
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
