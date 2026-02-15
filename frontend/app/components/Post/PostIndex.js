import {useState, useEffect, Children} from 'react';
import Axios from 'axios';
import PostCard from './PostCard';
import CommentForm from './CommentForm';
import MDEditor from '@uiw/react-md-editor';
import { isLoged } from '@/services/Cookies';

function Posts({blogslug}) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const uri = process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blogslug + "/lastPostsAJAX";
                // console.log(uri);
                const response = await Axios.get(uri);
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPosts();
    }, [blogslug]);

    return (
        <div className='margin1'>
            <ul className='list3'>
                {posts.map((post, index) => (
                    <PostCard 
                    index={index}
                    key={post.id}
                    urlImage={post.banner_img ? "url(" + "https://gameverse-app.vercel.app/img/blogs/" + post.banner_img + ") white" : "url(" + "https://gameverse-app.vercel.app/img/banner01.jpg) white"}
                    urlPost={"/blog/" + blogslug + "/" + post.slug}
                    postTitle={post.title}
                    />
                ))}
            </ul>
        </div>
    )

}

function Comments({ postslug, blogslug }) {
    const [comments, setComments] = useState([]);
  
    useEffect(() => {
      async function fetchSearchPost() {
        try {
          const uri = `${process.env.NEXT_PUBLIC_DB_HOST}/api/blog/${blogslug}/${postslug}`;
          const response = await Axios.get(uri);
          setComments(response.data.comments);
        } catch (error) {
          console.error(error);
        }
      }
  
      fetchSearchPost();
    }, [blogslug, postslug]);
  
    return (
      <section className='commentsSide'>
        {isLoged() && 
          <CommentForm blogSlug={blogslug} postSlug={postslug} newComment={true} />
        }
        {comments.length === 0 ? (
          <h4>There are no comments yet.</h4>
        ) : (
          <CommentsList comments={comments} />
        )}
      </section>
    );
  }

  function PostData({ postslug, blogslug }) {
    const [post, setPost] = useState({});
    const [blogger, setBlogger] = useState({});
  
    useEffect(() => {
      async function fetchSearchPost() {
        try {
          const uri = `${process.env.NEXT_PUBLIC_DB_HOST}/api/blog/${blogslug}/${postslug}`;
          const response = await Axios.get(uri);
          setPost(response.data.post);
          setBlogger(response.data.blogger);
        } catch (error) {
          console.error(error);
        }
      }
  
      fetchSearchPost();
    }, [blogslug, postslug]);
  
    return (
      <>
        <div className='postbox'>
          <h1>{post.title}</h1>
          <h3>{post.subtitle}</h3>
          <h3>{blogger.username}</h3>
          <div className='postcontent'>
            <MDEditor.Markdown source={post.content} />
          </div>
        </div>
        <div className='divFlex1'>
          <hr />
          <h3>Comments</h3>
          <hr />
        </div>
        <Comments postslug={postslug} blogslug={blogslug} />
      </>
    );
  }

  export default function PostIndex({ postslug, blogslug }) {
    return (
      <div className="content">
        <main>
          <PostData postslug={postslug} blogslug={blogslug} />
        </main>
        <aside>
          <Posts blogslug={blogslug} />
        </aside>
      </div>
    );
  }

  const CommentCardNew = ({ user_name, user_username, content, user_avatar, children, comment_id }) => {
    const childArray = Children.toArray(children);
    const form = childArray.find(child => child.type === CommentForm);
    const otherChildren = childArray.filter(child => child.type !== CommentForm);
  
    return (
      <div className='commentBox'>
        <div>
          <strong>{user_name} (@{user_username})</strong>
        </div>
        <div className='commentBoxContent'>{content}</div>
        {user_avatar && <img src={user_avatar} alt={`${user_username}'s avatar`} />}
        {otherChildren && otherChildren.length > 0 && (
          <div className='commentBoxChild'>
            {otherChildren.map(child => (
              <div key={child.key}>
                {child}
              </div>
            ))}
          </div>
        )}
        {isLoged() && form}
      </div>
    );
  };
  
  const buildCommentsHierarchy = (comments) => {
    const commentsById = {};
    const rootComments = [];
  
    // Crear un mapa de comentarios por ID
    comments.forEach(comment => {
      commentsById[comment.id] = { ...comment, children: [] };
    });
  
    // Construir la jerarquía
    comments.forEach(comment => {
      if (comment.parent_id === null) {
        rootComments.push(commentsById[comment.id]);
      } else if (commentsById[comment.parent_id]) {
        commentsById[comment.parent_id].children.push(commentsById[comment.id]);
      }
    });
  
    return rootComments;
  };
  
  const renderComments = (comments) => {
    return comments.map(comment => (
      <CommentCardNew
        key={comment.id}
        user_name={comment.user_name}
        user_username={comment.user_username}
        content={comment.content}
        user_avatar={comment.user_avatar}
        comment_id={comment.id}
      >
        {renderComments(comment.children)}
        <CommentForm comment_id={comment.id} newComment={false} />
      </CommentCardNew>
    ));
  };
  
  const CommentsList = ({ comments }) => {
    const hierarchicalComments = buildCommentsHierarchy(comments);
  
    return (
      <>
        {renderComments(hierarchicalComments)}
      </>
    );
  };