
import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";

const { TabPane } = Tabs;

function Adminscreen() {
    return (
        <div className='mt-3 ml-3 mr-3 bs'>
            <h1 style={{ fontSize: '25px' }}><b>Admin panel</b></h1>
            <Tabs defaultActiveKey="1" className="custom-tabs">
                <TabPane tab="Rezerwacje" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Pokoje" key="2">
                    <Rooms/>
                </TabPane>
                <TabPane tab="Dodaj pokój" key="3">
                    <h1 style={{ fontSize: '18px' }}>Dodaj pokój</h1>
                </TabPane>
                <TabPane tab="Użytkownicy" key="4">
                    <h1 style={{ fontSize: '18px' }}>Użytkownicy</h1>
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
