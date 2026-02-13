import './Modal.css'
import Image from 'next/image';

export default function Modal({ title, type, message }) {

    return (
        <div className={"modal " + type + "-modal"}>
            <div className='modal-content'>
                <img src={"/modal/modal-" + type + ".png"} alt={type} />
                <p className='modal-title'>{title}</p>
            </div>
            <p className='modal-message'>{message}</p>
        </div>
    )
}