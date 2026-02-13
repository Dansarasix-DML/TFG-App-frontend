import { useState } from 'react';
import { Api } from '@/services/Api';
import { getJwt, isLoged } from '@/services/Cookies';
import './CommentForm.css';

export default function CommentForm({blogSlug, postSlug, comment_id, newComment}) {
    const [content, setContent] = useState("");

    const [replying, setReplying] = useState(false)

    function replyHandler(e) {
        e.preventDefault();
        setReplying(!replying);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        data = Object.fromEntries(data.entries());

        if (!comment_id) {
            data.type = "new";
            Api.post("/blog/" + blogSlug + "/" + postSlug + "/addComment" , data, getJwt()).then(res => {
                if (res.statusCode === 201) {
                    console.log("Comment submitted");
                }
                location.reload();
            });
        } else {
            data.type = "reply";
            Api.post("/blog/comment/reply/" + comment_id , data, getJwt()).then(res => {
                if (res.statusCode === 201) {
                    console.log("Comment Reply submitted");
                }
                location.reload();
            });
        }
    }

    if (newComment) {
        console.log("2");
        return(
            <form action="" method="POST" className="commentForm" onSubmit={handleSubmit}>
                <p>Submit a comment</p>
                <textarea name="content" id="content" cols="30" rows="10" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                <div className="submitBox">
                    <input type="submit" value="Submit" />
                </div>
            </form>
        );
    }
    
    if (isLoged && newComment == false) {
        return(
            <>
            <a onClick={replyHandler}>Reply</a>
            {replying && (
                <form action="" method="POST" className="commentForm" onSubmit={handleSubmit}>
                    <p>Submit a comment</p>
                    <textarea name="content" id="content" cols="30" rows="10" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                    <div className="submitBox">
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            )}
            </>
        );
    }
    
}