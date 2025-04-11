import React, { useState, useEffect } from "react";

/* 
Options example: [{name: "a", type: "b"}] 
*/

function CreateOption({ name, type }, value, handleInputChange) {
  return (
    <div className="mb-4" key={name}>
      <label className="form-label" style={{ textTransform: "capitalize" }}>
        {name}
      </label>
      <input
        type={type}
        name={name}
        required
        className="form-control"
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
}

function createFormDataFromOptions(options) {
  const defaults = {
    text: "",
    textarea: "",
    amount: 0,
    number: 0,
    checkbox: false,
    select: "",
    date: new Date().toISOString().split("T")[0],
    email: "",
    password: "",
    radio: "",
    file: null,
    hidden: "",
  };

  const formData = {};

  for (const { name, type } of options) {
    formData[name] = defaults[type] ?? null;
  }

  return formData;
}

function CustomForm({ show, title, onSubmit, onClose, formOptions }) {
  const [formData, setFormData] = useState(
    createFormDataFromOptions(formOptions)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData);
  };

  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div
        className="bg-white rounded p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{title}</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          {formOptions.map((option) =>
            CreateOption(option, formData[option.name], handleInputChange)
          )}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomForm;
