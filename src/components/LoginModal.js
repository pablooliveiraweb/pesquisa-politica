import React from 'react';
import Modal from 'react-modal';
import Login from './Login';

Modal.setAppElement('#root');

const LoginModal = ({ isOpen, onRequestClose, onLoginSuccess }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <Login onLoginSuccess={onLoginSuccess} />
    </Modal>
  );
};

export default LoginModal;
