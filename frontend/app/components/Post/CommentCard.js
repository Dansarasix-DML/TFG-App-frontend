import { useState } from 'react';
import './CommentCard.css';
import CommentForm from './CommentForm';
import { isLoged } from '@/services/Cookies';

export default function CommentCard({user_name, user_username, content, user_avatar, comment_id}) {
    const [replying, setReplying] = useState(false)

    function replyHandler(e) {
        e.preventDefault();
        setReplying(!replying);
    }

    if (isLoged()) {
        return(
            <article className='commentBox'>
                <div>
                    <img src={user_avatar ? 'https://gameverse-app.vercel.app/img/users/' + user_avatar : 'https://gameverse-app.vercel.app/img/avatar01.png'} alt='' />
                    <p>{user_name} <strong>(@{user_username})</strong></p>
                </div>
                <p>{content}</p>
                <a onClick={replyHandler}>Reply</a>
                {replying && (
                    <div>
                        <CommentForm comment_id={comment_id}/>
                    </div>
                )}
            </article>
        )
    }

    return(
        <article className='commentBox'>
            <div>
                <img src={user_avatar ? 'https://gameverse-app.vercel.app/img/users/' + user_avatar : 'https://gameverse-app.vercel.app/img/avatar01.png'} alt='' />
                <p>{user_name} <strong>(@{user_username})</strong></p>
            </div>
            <p>{content}</p>
        </article>
    )
}