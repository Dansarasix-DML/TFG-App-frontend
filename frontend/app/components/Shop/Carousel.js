import {useState, useEffect, useRef, useCallback} from 'react';
import Axios from 'axios';
import './Carousel.css';
import Image from 'next/image';


export default function Carousel({productSlug}) {
    const [images, setImages] = useState([]);
    const [slide, setSlide] = useState(0);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/shop/productImagesAJAX/'+productSlug);
                setImages(response.data.images.split(', '));
            } catch (error) {
                console.error(error);
            }
        }

        fetchImages();
    }, [productSlug]);

    const startAutoSlide = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSlide(prevSlide => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
        }, 3000);
    }, [images.length]);

    useEffect(() => {
        startAutoSlide();

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [images, startAutoSlide]);

    const resetAutoSlide = () => {
        clearInterval(intervalRef.current); // Limpiar el intervalo cuando el componente se desmonte
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            startAutoSlide();
        }, 1000);
    };

    const nextSlide = () => {
        setSlide(slide === images.length - 1 ? 0 : slide + 1);
        resetAutoSlide();
    }

    const prevSlide = () => {
        setSlide(slide === 0 ? images.length - 1 : slide - 1);
        resetAutoSlide();
    }

    const goToSlide = (index) => {
        setSlide(index);
        resetAutoSlide();
    };

    return (
        <div className='carousel'>
            <div className='slides-container'>
                {images.map((image, index) => (
                    <img key={index} src={"https://api.gameverseproject.tech/img/blogs/"+image} alt={'photo_'+index} className={slide === index ? 'slide slide-enter' : ' slide slide-exit slide-hidden'} />
                ))}
            </div>
            <p className='arrow arrow-left' onClick={prevSlide}><i className="bi bi-arrow-left-circle-fill"></i></p>
            <p className='arrow arrow-right' onClick={nextSlide}><i className="bi bi-arrow-right-circle-fill"></i></p>
            <span className='indicators'>
                {images.map((__, index) => (
                    <button key={index} onClick={() => goToSlide(index)} className={slide === index ? 'indicator' : 'indicator indicator-inactive'}></button>
                ))}
            </span>
        </div>
    )
}