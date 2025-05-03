import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupLayout from './SetupLayout';
import WalletList from './WalletsList';
import FroggyMain from "../assets/FroggyMain.png";
import { UserContext } from "../contexts/UserContext";
import InputField from './InputField';

function Setup() {
  const { user, updateMonthlyBudget } = useContext(UserContext); // Access user and updateMonthlyBudget from context
  const [currentStep, setCurrentStep] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthly_budget || ""); // Initialize with user's current budget
  const [inputStatus, setInputStatus] = useState(""); // Track the status of the input field
  const navigate = useNavigate();

  const steps = [
    {
      title: `Welcome, ${user?.first_name || 'User'}!`,
      subtitle: "Let’s get you set up before we start",
      content: (
        <img src={FroggyMain} alt="Froggy Main"></img>
      ),
    },
    {
      title: "What types of wallets or accounts do you use?",
      subtitle: "You can add as many as you want",
      content: <WalletList />,
    },
    {
      title: "Setup Monthly Budget",
      subtitle: "Set your monthly budget to track your expenses.",
      content: (
        <div>
          <InputField
            label="Monthly Budget"
            type="number"
            placeholder="Enter your monthly budget"
            value={monthlyBudget}
            onChange={(e) => {
              setMonthlyBudget(e.target.value);
              setInputStatus("");
            }}
            message={inputStatus === "error" ? "Value must be greater than zero" : ""}
            messageType="error"
            status={inputStatus}
          />
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Validate the monthly budget before making the API call
      const budgetValue = parseFloat(monthlyBudget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        setInputStatus("error");
        return;
      }

      // Attempt to update the monthly budget
      const success = await updateMonthlyBudget(budgetValue);
      if (success) {
        navigate("/home");
      } else {
        setInputStatus("error");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SetupLayout
      title={steps[currentStep].title}
      subtitle={steps[currentStep].subtitle}
      onContinue={handleNext}
      showBack={currentStep > 0}
      onBack={handleBack}
    >
      {steps[currentStep].content}
    </SetupLayout>
  );
}

export default Setup;