import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

function Bookingscreen() {
  const { roomid, fromDate, toDate } = useParams();

  const [room, setRoom] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalamount, setTotalamount] = useState();

  const totalDays = moment(toDate, "DD-MM-YYYY").diff(
    moment(fromDate, "DD-MM-YYYY"),
    "days"
  );
  

  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setLoading(true);
        const data = (await axios.post("/api/rooms/getroombyid", { roomid })).data;
        setTotalamount(data.renpertday*totalDays);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setError(true);
        setLoading(false);
      }
    };

    console.log("Room ID:", roomid);
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);

    fetchRoomById();
  }, [roomid, fromDate, toDate]);

  const calculateTotalPrice = (totalDays) => {
    return totalDays * room.renpertday;
  };
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
      totalDays,  // Include totalDays in the bookingDetails
    };
  
    console.log("Booking details:", bookingDetails);  // Verify the booking details
  
    try {
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      alert('Booking done successfully');
    } catch (error) {
      console.error('Error during booking:', error.message, error.response);
    }
  }
  




  return (
    <div>
      {/* Rest of the component to display room details */}
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
              <p>Nazwa: {JSON.parse(localStorage.getItem('currentUser')).username}</p>
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
              <button className="btn btn-primary" onClick={bookRoom}>Zamów</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
