import React from "react";
import Button from "./Button";
import "../styles/SetupLayout.css";
import { Icon } from "@iconify/react";

const SetupLayout = ({
    title,
    subtitle,
    children,
    onContinue,
    showBack = false,
    onBack,
}) => {
    return (
        <div className="setup-container">
            {showBack && (
                <button className="back-button" onClick={onBack}>
                    <Icon icon="famicons:arrow-back-outline" width="24" height="24" style={{color: "var(--green)"}}/>
                </button>
            )}
            <header className="setup-header">
                <h1 className="setup-title">{title}</h1>
                {subtitle && <p className="setup-subtitle">{subtitle}</p>}
            </header>
            <section className="setup-body">{children}</section>
            <footer className="setup-footer">
                <Button type="large" text="Continue" onClick={onContinue}/>
            </footer>
        </div>
    );
};

export default SetupLayout;
