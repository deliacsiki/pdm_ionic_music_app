import React from "react";
import "./Spinner.css";

interface SpinnerProps {
    show: Boolean
}

const Spinner: React.FC<SpinnerProps> = ({ show }) => show ? <div className="loader">Loading...</div> : null;

export default Spinner;
