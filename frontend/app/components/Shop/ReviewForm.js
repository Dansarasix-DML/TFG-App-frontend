import { useState, useEffect } from 'react';
import { Api } from '@/services/Api';
import { getJwt, getCookies } from '@/services/Cookies';
import './ReviewForm.css';
import StarButton from '../Buttons/StarButton';
import Trash from '../Common/Trash';

export default function ReviewForm({productSlug, onReviewSubmit}) {
    const [url, setUrl] = useState(null);
    const [idReview, setIdReview] = useState(null);
    const [cookies, setCookies] = useState({});
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    useEffect(() => {
        setCookies(getCookies());
    }, [])

    useEffect(() => {
        Api.post("/shop/" + productSlug + "/userReview", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                setUrl(res.data[0] ? "/shop/" + productSlug + "/editReview" : "/shop/" + productSlug + "/addReview");
                setContent(res.data[0] ? res.data[0].content : "");
                setRating(res.data[0] ? res.data[0].rating : 0);
                setIdReview(res.data[0] ? res.data[0].id : null);
            }
        })
    }, [cookies, productSlug]);

    const handleDelete = () => {
        setRating(0);
        setContent("");
        const data = {productSlug: productSlug, id: idReview};
        Api.post("/shop/" + productSlug + "/deleteReview", data, getJwt()).then(res => {
            if (res.statusCode === 200) {
                console.log("Review deleted");
                onReviewSubmit();
                Api.post("/shop/" + productSlug + "/userReview", "", getJwt()).then(res => {
                    if (res.statusCode === 200) {
                        setUrl(res.data[0] ? "/shop/" + productSlug + "/editReview" : "/shop/" + productSlug + "/addReview");
                        setContent(res.data[0] ? res.data[0].content : "");
                        setRating(res.data[0] ? res.data[0].rating : 0);
                        setIdReview(res.data[0] ? res.data[0].id : null);
                    }
                })
            }
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = idReview ? {productSlug: productSlug, id: idReview, rating: rating, content: content} : 
        {productSlug: productSlug, rating: rating, content: content};
        Api.post(url, data, getJwt()).then(res => {
            if (res.statusCode === 201) {
                console.log("Review submitted");
                onReviewSubmit();
                if (!idReview) {
                    Api.post("/shop/" + productSlug + "/userReview", "", getJwt()).then(res => {
                        if (res.statusCode === 200) {
                            setUrl(res.data[0] ? "/shop/" + productSlug + "/editReview" : "/shop/" + productSlug + "/addReview");
                            setContent(res.data[0] ? res.data[0].content : "");
                            setRating(res.data[0] ? res.data[0].rating : 0);
                            setIdReview(res.data[0] ? res.data[0].id : null);
                        }
                    })
                }
            } else if (res.statusCode === 200) {
                console.log("Review edited");
                onReviewSubmit();
            }
        });
        // location.reload();
        
    }
    
    return(
        <form action="" method="POST" className="reviewForm" onSubmit={handleSubmit}>
            <div className='up-part'>
                <div className="ratingBox">
                    <label htmlFor="rating">Rating</label>
                    <StarButton id={0} startValue={rating} setDisabled={false} onRatingChange={handleRatingChange}/>
                </div>
                <div className="buttonsBox">
                    <button type="button" onClick={() => {
                        setRating(0);
                        setContent("");
                    }}><i className="bi bi-clipboard-x"></i></button>
                    {idReview && <button type="button" onClick={handleDelete}><Trash/></button>}
                </div>
            </div>
            <textarea name="content" id="content" cols="30" rows="10" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            <div className="submitBox">
                <input type="submit" value="Submit" />
            </div>
        </form>
    );
}