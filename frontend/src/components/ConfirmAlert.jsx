import React from 'react';
import Modal from "./Modal";
import Button from "./Button";

function ConfirmAlert({
    isOpen,
    children,
    title,
    mainActionTitle,
    secondActionTitle,
    onMainAction,
    onSecondAction,
}) {
    if (!isOpen) return null;

    return (
        <Modal
            className="modal-content confirm-alert"
            isOpen={isOpen}
            aria-labelledby="confirm-alert-title"
            aria-describedby="confirm-alert-description"
            role="dialog"
            aria-modal="true"
        >
            <header className="confirm-header">
                <h2 id="confirm-alert-title" className="modal-title">
                    {title || "Modal Title"}
                </h2>
            </header>
            <section id="confirm-alert-description" className="confirm-desc">
                <p className="modal-text">{children}</p>
            </section>
            <footer className="modal-footer">
                <Button
                    type="small"
                    text={secondActionTitle || "Cancel"}
                    className="modal-action-button secondary-button"
                    onClick={onSecondAction}
                />
                <Button
                    type="small"
                    text={mainActionTitle || "Confirm"}
                    className="modal-action-button"
                    onClick={onMainAction}
                />
            </footer>
        </Modal>
    );
}

export default ConfirmAlert;
