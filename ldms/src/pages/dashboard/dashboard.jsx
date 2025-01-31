// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import './dashboard.css';
import docDownload from "../../assets/images/doc_download.png";
import UploadModal from '../details/uploadModal';

const BULK_DATA = [
  { id: 1, title: "Legal Document 1", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 2, title: "Legal Document 2", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 3, title: "Legal Document 3", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 4, title: "Legal Document 4", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 5, title: "Legal Document 5", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 6, title: "Legal Document 6", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 7, title: "Legal Document 7", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 8, title: "Legal Document 8", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" },
  { id: 9, title: "Legal Document 9", filename: "Legal Document Management - Coding Challenge.pdf", uploadedOn: "01/25/2025" }
];

const Dashboard = () => {
  const [list, setList] = useState(BULK_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const showDocumentModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  }

  return (
    <div className='container'>
      <div className="card-container">
        {list.map((item, index) => {
          return (
            <div className="card" key={index} onClick={() => showDocumentModal(item)}>
              <div className='card-header'>
                <span className='card-title'>{item.title}</span>
              </div>
              <div className='card-content'>
                <div className='download-image text-center'>
                  <img src={docDownload} alt="download" className='w-[70px] m-auto mb-4' />
                </div>
                <div className="detail-info">
                  <div>
                    <span>Uploaded On: {item.uploadedOn}</span>
                  </div>
                  <div>
                    <span>File Name: {item.filename}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <UploadModal isOpen={isModalOpen} item={selectedItem} closeModal={closeModal} />
      </div>
    </div>
  );
};

export default Dashboard;
