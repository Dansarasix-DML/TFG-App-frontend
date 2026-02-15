import {useState, useEffect, useRef} from 'react';
import Axios from 'axios';
import './SearchTable.css';

function Boton({ onClickFun, disable, value }) {
    return(
      <button onClick={onClickFun} disabled={!disable}>
        {value}
      </button>
    );
}

function ProductFile({index, url, name, sale_price, typeName, blogTitle, urlProduct}) {

  const clickFn = () => {
    window.location.href = urlProduct;
  }

  return (
    <div className={index % 2 === 0 ? 'tr body' : "tr body resaltado"} onClick={clickFn}>
        <div className='cell tdimg border1' style={{backgroundImage: url}}>
        </div>
        <div className="cell border1 text">{name}</div>
        {/* <div className="cell border1"><a href={'/shop/'+item.slug}>{item.name}</a></div> */}
        <div className="cell border1">{sale_price} €</div>
        <div className="cell border1">
          <div className={typeName === 'game' ? 'tag text game' 
          : (typeName === 'demo' ? 'tag text demo' : 'tag text merch')}>{typeName}</div>
        </div>
        <div className="cell text">{blogTitle}</div>
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
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/shop/allProductsAJAX');
                setData(response.data.products);
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
              const response = await Axios.post(process.env.NEXT_PUBLIC_DB_HOST + `/api/shop/searchAJAX`, { search: searchTerm });
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
                <div className="cell border1"><strong>Product</strong></div>
                <div className="cell border1"><strong>Price (€)</strong></div>
                <div className="cell border1"><strong>Type</strong></div>
                <div className="cell"><strong>Blog</strong></div>
              </div>
              {itemsToDisplay.slice(startIndex, endIndex).map((item, index) => (
                <ProductFile 
                  key={item.id || index} 
                  index={index} 
                  url={`url(${"https://gameverse-app.vercel.app/img/blogs/" + item.imgs.split(',')[0]})`} 
                  name={item.name} 
                  sale_price={item.sale_price} 
                  typeName={item.typeName} 
                  blogTitle={item.blogTitle}
                  urlProduct={'/shop/'+item.slug}
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