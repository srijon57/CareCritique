/* eslint-disable react/prop-types */
import 'react';
const FileUpload = ({ fileNames, handleFileChange }) => {
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
                            onChange={(e) => handleFileChange(index + 1, e)} // Adjust index for certificates
                            accept=".png, .jpg, .jpeg, .pdf"
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
