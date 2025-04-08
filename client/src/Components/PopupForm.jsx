import React, { useState, useEffect } from "react";

function PopupForm({ show, onClose, onSubmit, categories }) {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData, formData.type);
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: "",
    }));
  }, [formData.type]);

  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div
        className="bg-white rounded p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Add Income/Expense</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Income or Expense?</label>
            <select
              name="type"
              required
              className="form-select"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {formData.type && categories?.[formData.type] && (
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                name="category"
                required
                className="form-select"
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

          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              required
              className="form-control"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Note</label>
            <input
              type="text"
              name="note"
              required
              className="form-control"
              value={formData.note}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              required
              className="form-control"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

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

export default PopupForm;
