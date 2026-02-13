import './ReviewCard.css';
import StarButton from '../Buttons/StarButton';
import Image from 'next/image';

export default function ReviewCard({ id, name, username, rating, content, avatar }) {
    return (
        <article className='review'>
            <div>
                <div>
                    <img src={avatar ? 'https://api.gameverseproject.tech/img/users/' + avatar : 'https://api.gameverseproject.tech/img/users/avatar.png'} alt='avatar' />
                    <p>{name} <strong>(@{username})</strong></p>
                </div>
                <div className='starsBox'>
                    <StarButton id={id} startValue={rating} />
                </div>
            </div>
            <p>{content}</p>
        </article>
    )
}