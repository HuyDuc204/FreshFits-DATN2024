import React from 'react';
import { useEffect, useState } from 'react';

import moment from 'moment';
import { toast } from 'react-toastify';

import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";



const DeleteShopCartModal = (props) => {

    let handleCloseModal = () => {
        props.closeModal()
    }
    let handleDelete = () => {
        props.handleDeleteShopCart()
    }
    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className="booking-modal-container" size="md" centered>
                <div className="modal-header">
                    <h5 className="modal-title text-center w-100">Bạn chắc chắn muốn bỏ sản phẩm này?</h5>
                    <button
                        onClick={handleCloseModal}
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                    ></button>
                </div>
                <ModalBody>
                    <div className="text-center" style={{ padding: '10px 20px', fontSize: '18px' }}>
                        {props.name}
                    </div>
                </ModalBody>
                <ModalFooter className="justify-content-center">
                    <Button color="danger" onClick={handleDelete} className="me-2 px-4">
                        Thực hiện
                    </Button>
                    <Button color="secondary" onClick={handleCloseModal} className="px-4">
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
export default DeleteShopCartModal;