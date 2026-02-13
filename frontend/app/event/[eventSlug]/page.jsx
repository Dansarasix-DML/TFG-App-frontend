'use client';

import { Api } from "@/services/Api";
import { getJwt } from "@/services/Cookies";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import '@/app/css/event.css'

export default function Event({ params }) {
    const eventSlug = params.eventSlug;
    const [event, setEvent] = useState({})

    useEffect(() => {
      Api.post("/event/"+eventSlug, "", getJwt()).then(res => {
        if(res.data.length === 0) {
            window.location.href = "/events";
        } else {
            setEvent(res.data)
        }
      })
    
    }, [eventSlug])
    
    return(
        <main>
            <div className="event-main-header" style={{backgroundImage: "url(https://api.gameverseproject.tech/img/events/" + event.banner_img + ")"}}>
                <h2 className="event-title">{event.title}</h2>
                <h3 className="event-subtitle">{event.subtitle}</h3>
            </div>
            <div className="event-icons-container">
                <i className="bi bi-clock"> {event.start_dtime}</i>
                <i className="bi bi-clock-history"> {event.end_dtime}</i>
                {(event.ubication) && (
                        <i className="bi bi-geo-alt"> {event.ubication}</i>
                )}
                {(event.section) && (
                        <i className="bi bi-geo"> {event.section}</i>
                )}
                <i className="bi bi-person"> {event.capacity}</i>
            </div>
            <hr className="event-hr"/>
            <div className="event-content">
                <MDEditor.Markdown source={event.content} />
            </div>
        </main>
    )
}
