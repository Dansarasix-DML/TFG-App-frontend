// FileUploader.jsx
import React, { useState } from 'react';
import './FileUploader.css';
import Trash from '../Common/Trash';
import Swal from 'sweetalert2';

const FileUploader = ({ onFilesChange }) => {
    const [files, setFiles] = useState([]);

    const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && !acceptedFileTypes.includes(file.type)) {
            // alert('Tipo de archivo no permitido. Por favor, sube una imagen.');
            Swal.fire({
                title: "Oops!",
                text: "This file type is not allowed. Please, upload an image.",
                icon: "error"
            });
            return;
        }

        const newFiles = [...files, file];
        setFiles(newFiles);

        // console.log(newFiles);

        onFilesChange(newFiles);
    };

    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        onFilesChange(newFiles);
    };

    return (
        <div className="file-uploader">
            {files.map((file, index) => (
                <div key={index} className="file-input-container">
                    {file && (
                        <>
                            <img src={URL.createObjectURL(file)} alt="preview" className="file-preview" />
                            <button type="button" onClick={() => handleRemoveFile(index)}><Trash /></button>
                        </>
                    )}
                </div>
            ))}
            <label htmlFor="file-input" className="file-label">
                Seleccionar archivo
            </label>
            <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
    
};

export default FileUploader;
