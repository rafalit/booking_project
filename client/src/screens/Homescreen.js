// Homescreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  return (
    <div className='container'>
      <div className="row justify-content-center ml-5">
        {loading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>Error fetching data. Please try again later.</h1>
        ) : (
          <div>
            <h1>Rooms:</h1>
            {rooms.map((room) => (
              <div key={room._id} className="col-md-9">
                <Room room={room} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homescreen;
