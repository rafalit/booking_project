import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey="1" className="custom-tabs">
        <TabPane tab="Profil użytkownika" key="1">
          <br />
          <h1 style={{ fontSize: '18px' }}>Login: {user.username}</h1>
          <h1 style={{ fontSize: '18px' }}>Email: {user.email}</h1>
          <h1 style={{ fontSize: '18px' }}>Admin: {user.isAdmin ? 'tak' : 'nie'}</h1>
        </TabPane>
        <TabPane tab="Rezerwacje" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

function MyBookings() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await axios.post('api/bookings/getbookingsbyuserid', { userid: user._id });
        setBookings(data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, [user._id]);

  async function cancelBooking(bookingid, roomid) {
    try {
      console.log(bookingid)
      console.log(roomid)
      setLoading(true);
      await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
      // Update state to reflect the canceled booking
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingid));
      setLoading(false);
      Swal.fire('', 'Rezerwacja została anulowana', 'success').then(result => {window.location.reload();});
      
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire('', 'Coś poszło nie tak', 'error');
    }
  }

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          {loading && (<Loader />)}
          {bookings && (bookings.map(booking => (
            <div className='bs' key={booking._id}>
              <h1>{booking.name}</h1>
              <p><b>Id Rezerwacji: </b>{booking._id}</p>
              <p><b>Data zakwaterowania: </b>{new Date(booking.fromDate).toLocaleDateString("en-GB")}</p>
              <p><b>Data wykwaterowania: </b>{new Date(booking.toDate).toLocaleDateString("en-GB")}</p>
              <p><b>Koszt: </b>{booking.totalamount}</p>
              <p><b>Status: </b>
                <span style={{ color: booking.status === 'booked' ? '#4CAF50' : '#FF0000' }}>
                  {booking.status === 'booked' ? "Zaakceptowane" : "Anulowane"}
                </span>
              </p>
              {booking.status === 'booked' && (
                <div className='text-right'>
                  <button className='btn btn-primary' onClick={() => { cancelBooking(booking._id, booking.roomid) }}>Anuluj zamówienie</button>
                </div>
              )}
            </div>
          )))}
          {error && (<Error message={error.message} />)}
        </div>
      </div>
    </div>
  );
}
