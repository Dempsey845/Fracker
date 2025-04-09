import React, { useState, useEffect } from "react";

function EditPopupForm({
  show,
  onClose,
  onSubmit,
  categories,
  data,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    id: data?.id || null,
    type: data?.type || "",
    category: data?.category || "",
    amount: data?.amount || "",
    note: data?.note || "",
    date: data?.date || new Date().toISOString().split("T")[0],
  });

  console.log("Data being passed", data);

  const prevType = data.type;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData((prev) => {
        console.log("prev type: ", prevType);
        return {
          ...prev,
          type: value,
          category: "", // reset category when type changes
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData, formData.type, prevType);
  };

  const handleOnDelete = () => {
    onDelete(formData.id, formData.type);
  };

  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div
        className="bg-white rounded p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Update</h4>
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

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              onClick={handleOnDelete}
              type="button"
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPopupForm;
