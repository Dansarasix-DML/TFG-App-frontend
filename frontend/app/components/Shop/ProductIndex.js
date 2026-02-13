import {useState, useEffect} from 'react';
import Axios from 'axios';
import Carousel from './Carousel';
import ProductData from './ProductData';
import ReviewCard from './ReviewCard';
import LastProducts from './LastProducts';
import '../../css/productIndex.css';
import Description from './Description';
import ReviewForm from './ReviewForm';
import { Api } from '@/services/Api';
import { getJwt } from '@/services/Cookies';

function Reviews({reviews, fetchReviews}) {

    return(
        <section className='reviews'>
            {reviews.length === 0 ? <h4>No reviews yet</h4>
               : (reviews.map((review) => (
                <ReviewCard 
                    key={review.id} 
                    id={review.id}
                    name={review.name}
                    username={review.UserName} 
                    rating={review.rating} 
                    content={review.content} 
                    avatar={review.avatar} 
                />
            )))}
        </section>
    )
}

export default function ProductIndex({productSlug}) {
    const [desc, setDesc] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loged, setLoged] = useState(false);

    const fetchReviews = async () => {
        try {
            const response = await Axios.get(process.env.DB_HOST + `/api/shop/${productSlug}/reviews`);
            setReviews(response.data.reviews);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await Axios.get(process.env.DB_HOST + '/api/shop/productDataAJAX/'+productSlug);
                setDesc(response.data.product.description);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProduct();
        fetchReviews();
    }, [productSlug]);

    useEffect(() => {
        Api.post("/auth/me", "", getJwt()).then(res => {
          if (res.data.id) {
              setLoged(true);
            }
          }
        )
    }, [])

    return (
        <main>
            <div className='productData'>
                <Carousel productSlug={productSlug} />
                <ProductData productSlug={productSlug} />
            </div>
            <Description description={desc} />
            {/* <p className='desc'><span>Description:</span>{desc}</p> */}
            <div className='lastProductsBox'>
                <div className='divFlex1'>
                    <hr className='hr1'/>
                    <h2 className="sectionSubtitle">Last Products</h2>
                    <hr className='hr1'/>
                </div>
                <LastProducts />
            </div>
            <div className='reviewsBox'>
                <div className='divFlex1'>
                    <hr />
                    <h2 className="sectionSubtitle">Reviews</h2>
                    <hr />
                </div>
                {loged && (<ReviewForm productSlug={productSlug} onReviewSubmit={fetchReviews} />)}
                <Reviews reviews={reviews} fetchReviews={fetchReviews}/>
            </div>
        </main>
    )
}