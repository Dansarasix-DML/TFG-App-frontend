import './Error.css';

export default function Error({ error, content }) {
    return (
        <div className="error">
            <h2>{error}</h2>
            <h4>Error:</h4>
            <p>{content}</p>
        </div>
    )
}