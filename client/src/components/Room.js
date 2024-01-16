import React, { useState } from "react";
import { Link } from "react-router-dom";

// Komponent Room
function Room({ room, fromDate, toDate }) {
    console.log("Room Data:", room);
    
    // Stan do kontrolowania widoczności modalu
    const [show, setShow] = useState(false);

    // Funkcje do otwierania i zamykania modalu
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Warunek sprawdzający kompletność danych o pokoju
    if (!room || !room.imageurl || !Array.isArray(room.imageurl) || room.imageurl.length === 0) {
        return <div>Error: Room data is incomplete</div>;
    }

    // Logowanie adresów URL obrazków pokoju
    console.log("Image URLs:", room.imageurl);

    return (
        <div className='row bs'>
            <div className='col-md-4'>
                <img src={room.imageurl[0]} alt="" className='smallimg' />
            </div>
            <div className='col-md-8'>
                <div>
                    <h1>{room.name}</h1>
                </div>

                <div>
                    <p>Liczba gości: {room.maxcount}</p>
                </div>
                <div>
                    <p>Cena za noc: {room.renpertday}</p>
                </div>
                <div>
                    <p>Opis: {room.description}</p>
                </div>
                <div>
                    <p>Typ: {room.type}</p>
                </div>
                <div>
                    <p>Telefon: {room.phoneNumber}</p>
                </div>

                <div style={{ float: "right" }}>
                    {/* Przekierowanie do strony rezerwacji z danymi pokoju */}
                    <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
                        <button className='btn btn-primary m-2'>Book Now</button>
                    </Link>
                    {/* Przycisk otwierający modal z dodatkowymi detalami pokoju */}
                    <button className='btn btn-primary' onClick={handleShow}>View Details</button>
                </div>
            </div>
        </div>
    );
}

// Eksportuje komponent Room do użycia w innych częściach aplikacji
export default Room;
