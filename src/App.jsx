import { useState,useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AboutPage from "./pages/AboutPage";

function App() {

    const [events, setEvents] = useState([]);
    const [editingEvent,setEditingEvent] = useState(null);
    const navigate = useNavigate();


        useEffect(()=>{
        fetch("http://localhost:5001/api/events")
        .then((response)=>response.json())
        .then((data)=>{
            setEvents(data);
        });
    }, []);

    function handleAddEvent(newEvent) {
        fetch("http://localhost:5001/api/events",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newEvent)
        }).then((response) => response.json())
        .then((data) =>{
            console.log(data);
            fetch("http://localhost:5001/api/events")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            });
        });
    }

    function handleDeleteEvent(eventId) {
        fetch(`http://localhost:5001/api/events/${eventId}`, {
            method: "DELETE"
        }).then((response)=>response.json())
        .then((data)=>{
            console.log(data);
            fetch("http://localhost:5001/api/events")
            .then((response)=>response.json())
            .then((data)=>{
                setEvents(data);
            });
        });
    }

    function handleUpdateEvent(eventId, updatedEvent) {
        fetch(`http://localhost:5001/api/events/${eventId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedEvent)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setEvents((currentEvents) => currentEvents.map((event) =>
                event.id === eventId ? { ...event, ...updatedEvent } : event
            ));
            setEditingEvent(null);
        });
    }


    function handleEditEvent(eventId){
        const selectedEvent = events.find(function(event){
            return event.id === eventId;
        });
        setEditingEvent(selectedEvent);
        navigate("/");

    }

    return (
        <div>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            events={events}
                            onAddEvent={handleAddEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent}
                            editingEvent = {editingEvent}
                        />
                    }
                />

                <Route
                    path="/events"
                    element={
                        <EventsPage
                            events={events}
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent}
                           
                        />
                    }
                />

                <Route
                    path="/events/:eventId"
                    element={
                        <EventDetailsPage
                            events={events}
                        />
                    }
                />

                <Route
                    path="/about"
                    element={<AboutPage />}
                />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;