// Room.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Carousel } from 'react-bootstrap'

function Room({ room, fromDate, toDate }) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (!room || !room.imageurl || !Array.isArray(room.imageurl) || room.imageurl.length === 0) {
        return <div>Error: Room data is incomplete</div>;
    }

    const isDatesSelected = fromDate && toDate;

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
                    <p>Miasto: {room.city}</p>
                </div>
                <div>
                    <p>Liczba gości: {room.maxcount}</p>
                </div>
                <div>
                    <p>Cena za noc: {room.rentperday}</p>
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
                    {isDatesSelected && (
                        <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
                            <button className='btn btn-primary m-2'>Book Now</button>
                        </Link>
                    )}

                    <button className='btn btn-primary' onClick={handleShow}>View Details</button>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{ fontSize: '2.5em', textAlign: 'center', margin: 'auto' }}>
                        {room.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel prevLabel='' nextLabel=''>
                        {room.imageurl.map(url => {
                            return <Carousel.Item>
                                <img
                                    className="d-block w-100 bigimg"
                                    src={url}
                                />
                            </Carousel.Item>
                        })}
                    </Carousel>
                    <pr>{room.description}</pr>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Room;