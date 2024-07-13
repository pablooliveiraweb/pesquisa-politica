// src/components/ModalComponent.js

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles.css';

const ModalComponent = ({ isOpen, onRequestClose, message }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const nextProgress = prevProgress - 1;
          if (nextProgress <= 0) {
            clearInterval(interval);
            onRequestClose();
          }
          return nextProgress;
        });
      }, 40); // 4 segundos total, decrementando a cada 40ms
    } else {
      setProgress(100);
    }
  }, [isOpen, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <p>{message}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </Modal>
  );
};

export default ModalComponent;
