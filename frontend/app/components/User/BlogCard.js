import './BlogCard.css';
import Image from 'next/image';

export default function BlogCard({title, slug, banner, profile}) {
    const clickFn = () => {
        window.location.href = "/blog/"+slug;
    }

    return (
        <li style={{backgroundImage: "url(" + banner + ")"}} onClick={clickFn}>
            <div className='blogData'>
                <img src={profile ? profile : "https://gameverse-app.vercel.app/img/users/avatar.png"} alt="profile" />
                <p>{title}</p>
            </div>
            <div className='back'></div>
        </li>
    );
}