import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from 'react-stripe-checkout';
import { set } from "mongoose";
import Swal from 'sweetalert2';

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
  

  // Poprawiona część kodu w Bookingscreen
useEffect(() => {
  const fetchRoomById = async () => {
    try {
      setLoading(true);
      const data = (await axios.post("/api/rooms/getroombyid", { roomid })).data;
      setRoom(data);
      setTotalamount(await calculateTotalPrice(totalDays));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching room:", error);
      setError(true);
      setLoading(false);
    }
  };

  const calculateTotalPrice = async (totalDays) => {
    return totalDays * room.rentperday;
  };

  fetchRoomById();
}, [roomid, fromDate, toDate]);

  const calculateTotalPrice = (totalDays) => {
    return totalDays * room.rentperday;
  };
  async function onToken(token) {
    //console.log(token);
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
      token,
    };
  
    //console.log("Booking details:", bookingDetails);  // Verify the booking details
  
    try {
      setLoading(true);
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      setLoading(false);
      Swal.fire('Success', 'Zarezerwowano pokój', 'success').then(result => {
        window.location.href = '/bookings'
      })
     // alert('Booking done successfully');
    } catch (error) {
      setLoading(false);
      Swal.fire('Error', 'Nie udało się zarezerwować pokoju', 'error')
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
                <p>Cena za noc: {room.rentperday}</p>
                <p>Całość: {calculateTotalPrice(totalDays)}</p>
              </b>
            </div>

            <div>
              <StripeCheckout
                token={onToken}
                amount={totalamount * 100}  // Make sure totalamount is in the correct currency and format
                currency="PLN"
                stripeKey="pk_test_51OYurRJuf3K9tPXcZcPZIaXTgENwFOSldsVbQcIwEjwk6qrUTH7mf0DU8teJEBSF0WRkaoHVXn4HgvMqCLsFiG2q00QEBZtUly"
              >
                <button className="btn btn-primary">Zapłać</button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;