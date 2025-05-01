import React from 'react';
import { Icon } from "@iconify/react";
import Button from './Button';

function ModalFooter({ onDelete, onAction, actionTitle}) {
    return (
        <footer className="modal-footer">
            <button className="modal-delete-button" onClick={onDelete}>
                <Icon
                    icon="mdi:delete"
                    width="3rem"
                    height="3rem"
                    style={{
                    color: "var(--red)",
                    }}
                />
            </button>
            <Button
                type="small"
                text={actionTitle || 'Action'}
                className="modal-action-button" onClick={onAction}>
            </Button>
        </footer>
    );
}

export default ModalFooter;