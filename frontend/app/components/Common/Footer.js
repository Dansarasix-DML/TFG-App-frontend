export default function Footer() {
    return (
        <footer className='footer'>
            <div className="footer-up">
                <div className="footer-left">
                    <p>©2024 <span>GameVerse</span></p>
                </div>
                <div className="footer-center">
                    <img src="/img/gameverse.png"></img>
                </div>
            </div>
            <hr></hr>
            <div className="footer-right">
                <ul>
                    <a href=""><li><i className="bi bi-instagram"></i></li></a>
                    <a href=""><li><i className="bi bi-twitter"></i></li></a>
                    <a href=""><li><i className="bi bi-youtube"></i></li></a>
                    <a href=""><li><i className="bi bi-facebook"></i></li></a>
                </ul>
            </div>
        </footer>
    )
}