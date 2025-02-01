// src/pages/details/uploadModal.jsx
import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import "./uploadModal.css";
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css'; // Import Annotation Layer CSS

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

Modal.setAppElement('#root');

const UploadModal = (props) => {
  const [detailsInfo, setDetailsInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [error, setError] = useState('');
  const [extractions, setExtractions] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadStatus, setUploadStatus] = useState(false);

  // Create refs for the pages
  const pageRefs = useRef([]);

  useEffect(() => {
    if (props) {
      setIsOpen(props.isOpen);
      setDetailsInfo(props.item);
      setFilePath(props?.item?.filePath);
      generateExtractions();
    }
  }, [props.isOpen, props.item]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill().map(() => React.createRef());
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFilePath(URL.createObjectURL(selectedFile));
      generateExtractions();
      setPageNumber(1);
      setError('');
    } else {
      setFile(null);
      setFilePath(null);
      setError('Please select a valid PDF file.');
    }
  };

  const generateExtractions = () => {
    const numExtractions = 5; // Number of mock extractions
    const newExtractions = Array.from({ length: numExtractions }, (_, index) => ({
      id: index + 1,
      page: index + 1,
      text: `Extraction ${index + 1}`,
    }));
    setExtractions(newExtractions);
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= numPages) {
      setPageNumber(pageNumber);
      const pageElement = pageRefs.current[pageNumber - 1]?.current; // Access the current DOM element

      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error(`Page element for page ${pageNumber} is undefined.`);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return; console.log(file)

    const formData = new FormData();
    formData.append('file', file);
    formData.append('docNumber', detailsInfo.id);

    try {
      const response = await axios.post('http://localhost:4000/api/upload/pdf', formData);
      // Handle response if needed
      if (response.status === 200) {
        setUploadStatus(true);
        setIsOpen(false);
        setPageNumber(1);
        setFile(null);
        setFilePath(null);
        setError('');
        props.getAllFiles();
      }
    } catch (err) {
      setError('Error uploading file');
    }
  };

  const cancel = () => {
    setPageNumber(1);
    setFile(null);
    setFilePath(null);
    setError('');
    props.closeModal();
  }

  return (
    <>
      {uploadStatus &&
        <div id="toast-success" className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm top-5 right-5 dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800" role="alert">
          <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ms-3 text-sm font-normal">File uploaded successfully</div>
          <button type="button" onClick={() => setUploadStatus(false)}
            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-success" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      }
      <Modal
        isOpen={isOpen}
        onRequestClose={props?.closeModal}
        contentLabel="Modal"
        className={{
          base: "modal-base",
          afterOpen: "modal-base_after-open",
          beforeClose: "modal-base_before-close"
        }}
        overlayClassName={{
          base: "overlay-base",
          afterOpen: "overlay-base_after-open",
          beforeClose: "overlay-base_before-close"
        }}
      >
        <div className="relative w-full max-h-full">
          <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload Document (Legal Document {detailsInfo?.id})
              </h3>
              <button type="button" onClick={props.closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex 
                justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4 pdf-view">
              {filePath ?
                <div className='pdf-container' style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
                  <div className="left-panel">
                    <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
                      {Array.from({ length: numPages }, (_, index) => (
                        <div key={index} ref={pageRefs.current[index]}>
                          <Page
                            key={index}
                            pageNumber={index + 1}
                          />
                        </div>
                      ))}
                    </Document>
                  </div>
                  <div className="right-panel">
                    <h3>Extractions</h3>
                    <ul>
                      {extractions.map((extraction) => (
                        <li key={extraction.id} className='py-2'>
                          {extraction.text} (Page {extraction.page})
                          <button data-modal-hide="default-modal" type="button" onClick={() => goToPage(extraction.page)}
                            className="py-1 px-3 mr-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 
                          hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 
                          dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Go To Page
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div> :
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-24 h-20 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 15">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Drag files here</span> or click to select files</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, XLS, CSV, and PDF files are allowed.</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf" />
                  </label>
                </div>
              }
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button data-modal-hide="default-modal" type="button" onClick={cancel}
                className="py-2.5 px-5 mr-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 
                hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 
                dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Cancel
              </button>
              <button data-modal-hide="default-modal" type="button" onClick={handleUpload}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Submit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UploadModal;