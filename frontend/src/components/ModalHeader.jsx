import React from 'react';
import { Icon } from "@iconify-icon/react";

function ModalHeader({ title, onClose }) {
    return (
        <header className="modal-header">
            <h2 className="modal-title">{title || 'Modal Title'}</h2>
            <button className="modal-close" onClick={onClose}>
                <Icon
                    icon="line-md:close-circle-filled"
                    width="3rem"
                    height="3rem"
                    style={{
                        color: "var(--gray)",
                    }}
                />
            </button>
        </header>
    );
}

export default ModalHeader;