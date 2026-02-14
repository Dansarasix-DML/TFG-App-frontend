import {useState, useEffect, useRef} from 'react';
import Axios from 'axios';
import '../Shop/SearchTable.css';


function Boton({ onClickFun, disable, value }) {
    return(
      <button onClick={onClickFun} disabled={!disable}>
        {value}
      </button>
    );
}

function EventFile({index, url, name, start_date, end_date, capacity, urlEvent}) {

  const clickFn = () => {
    window.location.href = urlEvent;
  }

  return (
    <div className={index % 2 === 0 ? 'tr body' : "tr body resaltado"} onClick={clickFn}>
        <div className='cell tdimg border1' style={{backgroundImage: url}}>
        </div>
        <div className="cell border1 text">{name}</div>
        {/* <div className="cell border1"><a href={'/shop/'+item.slug}>{item.name}</a></div> */}
        <div className="cell border1">{start_date}</div>
        <div className="cell border1">{end_date}</div>
        <div className="cell">{capacity}</div>
    </div>
  );
}

function Panel() {
    const [data, setData] = useState([]);
    // const [count, setCount] = useState(0);
    const [searchResults, setSearchResults] = useState(null);
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/event/allEventsAJAX');
                setData(response.data.events);
                // setCount(response.data.products.length);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const handleSearchChange = async (event) => {
        const searchTerm = event.target.value;

        if (searchTerm.trim() !== '') {
          try {
              const response = await Axios.post(process.env.NEXT_PUBLIC_DB_HOST + `/api/event/searchAJAX`, { search: searchTerm });
              setSearchResults(response.data.search);
              // setCount(response.data.search.length);
          } catch (error) {
              console.error("Error al obtener la búsqueda:", error);
              setSearchResults(null);
          }
        } else {
          setSearchResults(null);
        }
    };

    const count = (searchResults && searchResults.length > 0) ? searchResults.length : data.length;
    
    const startIndex = page * parseInt(itemsPerPage, 10);
    const endIndex = startIndex + parseInt(itemsPerPage, 10);    

    const hasPrevious = page > 0;
    const hasNext = endIndex < count;

    function handleNextClick() {
      if (hasNext) {
        setPage(page + 1);
      }
    }

    function handlePreviousClick() {
      if (hasPrevious) {
        setPage(page - 1);
      }
    }

    const handleMuestraChange = async (event) => {
      setItemsPerPage(event.target.value);
      setPage(0);
      
    }

    const itemsToDisplay = (searchResults && searchResults.length > 0) ? searchResults : data;

    return (
        <div className='panel'>

            <div className='table'>
              <div className='searchBox'>

                  <form className='search'>
                      <label>Search: </label><input type='search' name='searchInput' onChange={handleSearchChange} />          
                  </form>
                  
                  <form className='muestra'>
                      <label>Sample: </label>
                      <select name="muestraSelect" onChange={handleMuestraChange}>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      </select>
                  </form>
              </div>
              <div className='head tr'>
                <div className='headColor cell border1'></div>
                <div className="cell border1"><strong>Event</strong></div>
                <div className="cell border1"><strong>Start Date</strong></div>
                <div className="cell border1"><strong>End Date</strong></div>
                <div className="cell"><strong>Capacity</strong></div>
              </div>
              {itemsToDisplay.slice(startIndex, endIndex).map((item, index) => (
                <EventFile 
                  key={item.id || index} 
                  index={index} 
                  url={`url(${"https://api.gameverseproject.tech/img/events/" + item.banner_img})`} 
                  name={item.title} 
                  start_date={item.start_dtime} 
                  end_date={item.end_dtime} 
                  capacity={item.capacity}
                  urlEvent={'/event/'+item.slug}
                />
              ))}
              <div className='resultados'>
                  <p className='registros'>
                    Showing {searchResults ? searchResults.length : count} records
                  </p>

                  <div>
                      <Boton onClickFun={handlePreviousClick} disable={hasPrevious} value='Previous'/>
                      <Boton onClickFun={handleNextClick} disable={hasNext} value='Next'/>
                  </div>
              </div>
            </div>

        </div>
      );
}

export default function SearchTable() {
    return (
        <Panel />
      );
}