import React from 'react';
import Card from '../components/Card';
import '../styles/BalanceSummary.css'; // Import your CSS file for styling
import FroggyImage from '../assets/Froggy.png';

function BalanceSummary() {
  return (
    <Card className="bg-main-color white-color balance-summary">
        <div>
            <p>Balance</p>
            <h1 className='balance'>$100</h1>
        </div>
        <div className="stats">
            <div className="stats-item">
                <p>Expenses</p>
                <p className='bold'>$100</p> 
            </div>
            <div className="stats-item">
                <p>Income</p>
                <p className='bold'>$100</p>
            </div>
        </div>
        <img src={FroggyImage} className="overlay-image" alt="Froggy" />
    </Card>
  );
}

export default BalanceSummary;