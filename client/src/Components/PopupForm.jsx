import React, { useState, useEffect } from "react";

function PopupForm({ show, onClose, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    onSubmit(e, formData, formData.type); // Pass event, form data, and type
  };

  useEffect(() => {
    // Reset category when type changes
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: "", // Reset category selection when type changes
    }));
  }, [formData.type]);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Add Income/Expense</h2>

          {/* Select Type: Income or Expense */}
          <div>
            <label>Income or Expense?</label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {console.log(categories)}
          {/* Categories Dropdown */}
          {formData.type && categories && categories[formData.type] && (
            <div>
              <label>Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories[formData.type].map((category, index) => (
                  <option
                    key={index}
                    value={category.toLowerCase().replace(/\s+/g, "")}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              required
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>

          {/* Description Input */}
          <div>
            <label>Note:</label>
            <input
              type="text"
              name="note"
              required
              value={formData.note}
              onChange={handleInputChange}
            />
          </div>

          {/* Date Input */}
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    float: "right",
  },
};

export default PopupForm;
