import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import ProductCard from '../Common/ProductCard';
import SearchTable from './SearchTable';
import '../Common/ProductCard.css';
import EventCard from './EventCard';

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/event/lastEventsAJAX');
                setEvents(response.data.events);
                console.log(response.data.events);
            } catch (error) {
                console.error(error);
            }
        }
        fetchEvents();
    }, []);

    return (
        <section className='last-blogs'>
            {events.map(event => (
                <EventCard 
                    banner={(event.banner_img !== "" && event.banner_img !== " " && event.banner_img) ? event.banner_img : "default_banner.jpeg"}
                    title={event.title}
                    blogTitle={event.blogTitle}
                    blogSlug={event.blogSlug}
                    slug={event.slug}
                    key={event.id}
                />
            
            ))}
        </section>

    );

}

export default function IndexEvent() {
    return (
      <>
        <div className='divFlex1'>
            <hr/>
            <h2 className="sectionSubtitle">Last Events</h2>
            <hr/>
        </div>
        <Events />
        <div className='divFlex1'>
            <hr/>
            <h2 className="sectionSubtitle">Search</h2>
            <hr/>
        </div>
        <SearchTable />
      </>
    );
}