import { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ fileNames, setFileNames }) => {
    const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dgtqiuv9z/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'carecritique';

    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newFileNames = [...fileNames];
            newFileNames[index] = response.data.secure_url;
            setFileNames(newFileNames);
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Upload Valid Certificates
            </label>
            <div className="flex gap-4">
                {fileNames.map((fileName, index) => (
                    <label
                        key={index}
                        className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-600 transition-colors duration-300"
                    >
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(index, e)}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {fileName || 'Click to upload'}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;
