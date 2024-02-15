
import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';


const { TabPane } = Tabs;

function Adminscreen() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingAdminStatus, setLoadingAdminStatus] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (!currentUser || !currentUser.isAdmin) {
                setIsAdmin(false);
                setLoadingAdminStatus(false);
                // Optionally, show an error message
                Swal.fire('', 'Nie posiadasz uprawnień!', 'error');
            } else {
                setIsAdmin(true);
                setLoadingAdminStatus(false);
            }
        };

        // Call the function with a delay of 0 milliseconds to allow rendering before executing the check
        checkAdminStatus();
    }, []);

    if (loadingAdminStatus) {
        // You may want to render a loader while checking admin status
        return <Loader />;
    }

    if (!isAdmin) {
        // Render an empty or error component if the user is not an admin
        return <Error message="Nie posiadasz uprawnień!" />;
    }


    
    return (
        <div className='mt-3 ml-3 mr-3 bs'>
            <h1 style={{ fontSize: '25px' }}><b>Admin panel</b></h1>
            <Tabs defaultActiveKey="1" className="custom-tabs">
                <TabPane tab="Rezerwacje" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Pokoje" key="2">
                    <Rooms />
                </TabPane>
                <TabPane tab="Dodaj pokój" key="3">
                    <h1 style={{ fontSize: '18px' }}>Dodaj pokój</h1>
                </TabPane>
                <TabPane tab="Użytkownicy" key="4">
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Adminscreen;


export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get("/api/bookings/getallbookings");
                setbookings(data.data);
                setloading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                seterror("Error fetching bookings. Please try again.");
                setloading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1 style={{ fontSize: '18px' }}>Rezerwacje</h1>
                {loading && <Loader />}

                <table className='table table-bordered table-dark'>
                    <thead className='bs thead-dark'>
                        <tr>
                            <th>Id rezerwacji</th>
                            <th>Id użytkownika</th>
                            <th>Pokój</th>
                            <th>Data_od</th>
                            <th>Data_do</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.length && (bookings.map(booking => {
                            const statusStyle = booking.status === 'booked' ? { backgroundColor: '#4CAF50', color: 'white' } : { backgroundColor: '#FF0000', color: 'white' };

                            return (
                                <tr key={booking._id}>
                                    <td>{booking._id}</td>
                                    <td>{booking.username}</td>
                                    <td>{booking.name}</td>
                                    <td>{booking.fromDate}</td>
                                    <td>{booking.toDate}</td>
                                    <td style={statusStyle}>{booking.status}</td>
                                </tr>
                            );
                        }))}
                    </tbody>
                </table>


                {error && <Error message={error} />}

            </div>
        </div>
    );
}

export function Rooms() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get("/api/rooms/getallrooms");
                setrooms(data.data);
                setloading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                seterror("Error fetching bookings. Please try again.");
                setloading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1 style={{ fontSize: '18px' }}>Pokoje</h1>
                {loading && <Loader />}

                <table className='table table-bordered table-dark'>
                    <thead className='bs thead-dark'>
                        <tr>
                            <th>Id pokoju</th>
                            <th>Nazwa</th>
                            <th>Typ</th>
                            <th>Opłata za noc</th>
                            <th>Ilość gości</th>
                            <th>Numer telefonu</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rooms.length && (rooms.map(room => {

                            return (
                                <tr>
                                    <td>{room._id}</td>
                                    <td>{room.name}</td>
                                    <td>{room.type}</td>
                                    <td>{room.rentperday}</td>
                                    <td>{room.maxcount}</td>
                                    <td>{room.phoneNumber}</td>
                                </tr>
                            );
                        }))}
                    </tbody>
                </table>


                {error && <Error message={error} />}

            </div>
        </div>
    );
}

export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get("/api/users/getallusers");
                setusers(data.data);
                setloading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                seterror("Error fetching bookings. Please try again.");
                setloading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>

                <h1>Użytkownicy</h1>
                {loading && <Loader />}
                <table className='table table-dark table-bordered'>
                    <thead>
                        <tr>
                            <th>Id użytkownika</th>
                            <th>Nazwa</th>
                            <th>Email</th>
                            <th>isAdmin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users && (users.map(user => {

                            return (
                                <tr>
                                    <td>{user._id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? 'Tak' : 'Nie'}</td>
                                </tr>
                            );
                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    )

}
