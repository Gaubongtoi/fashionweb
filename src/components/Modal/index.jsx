import '~/CustomModal.css';
import Modal from 'react-modal';

function ModalComp({ children, showModal, handleClose }) {
    // const [showModal, setShowModal] = useState(false);
    return (
        <Modal
            isOpen={showModal}
            onRequestClose={handleClose}
            style={{
                overlay: {
                    // backgroundColor: 'papayawhip',
                    zIndex: '10',
                },
            }}
            ariaHideApp={false}
        >
            {children}
        </Modal>
    );
}

export default ModalComp;
