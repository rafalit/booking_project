// Room.js
import React from "react";

function Room({ room }) {
    console.log("Room Data:", room);

    if (!room || !room.imageurl || !Array.isArray(room.imageurl) || room.imageurl.length === 0) {
        return <div>Error: Room data is incomplete</div>;
    }

    // Log the image URLs
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
                <b>
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
                </b>
                <div>
                    <p>Telefon: {room.phoneNumber}</p>
                </div>
                <div style={{ float: "right" }}>
                    <button className='btn btn-primary'>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Room;
