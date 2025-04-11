import React, { useState } from "react";
import ProgresPie from "./ProgressPie";

function Goal({
  formData,
  currency,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) {
  const [editData, setEditData] = useState({
    name: formData.name,
    note: formData.note,
    start_amount: formData["start amount"] ?? formData.start_amount,
    target_amount: formData["target amount"] ?? formData.target_amount,
    target_date: formData["target date"] ?? formData.target_date,
  });

  console.log("EditData in Goal: ", editData);
  console.log("FormData in Goal: ", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Basic validation
    if (!editData.name || !editData.target_amount) {
      alert("Name and Target Amount are required!");
      return;
    }
    onSave(editData);
  };

  const handleCancel = () => {
    // Reset the form data to initial state
    setEditData({
      name: formData.name,
      note: formData.note,
      start_amount: formData["start amount"] ?? formData.start_amount,
      target_amount: formData["target amount"] ?? formData.target_amount,
      target_date: formData["target date"] ?? formData.target_date,
    });
    onCancel();
  };

  return (
    <div className="card shadow-sm" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              className="form-control mb-2"
              type="text"
              name="name"
              value={editData.name}
              onChange={handleChange}
              placeholder="Goal name"
            />
            <textarea
              className="form-control mb-2"
              name="note"
              value={editData.note}
              onChange={handleChange}
              placeholder="Note"
            />
            <input
              className="form-control mb-2"
              type="number"
              name="start_amount"
              value={editData.start_amount}
              onChange={handleChange}
              placeholder="Start Amount"
            />
            <input
              className="form-control mb-2"
              type="number"
              name="target_amount"
              value={editData.target_amount}
              onChange={handleChange}
              placeholder="Target Amount"
            />
            <input
              className="form-control mb-2"
              type="date"
              name="target_date"
              value={editData.target_date?.split("T")[0]} // ISO fix
              onChange={handleChange}
            />
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h5 className="card-title">{formData.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{formData.note}</h6>
            <p className="card-text">
              <small className="text-muted">
                Target Date: {formData["target date"]}
              </small>
            </p>
            <div className="d-flex justify-content-center my-3">
              <ProgresPie
                current={formData.start_amount}
                target={formData.target_amount}
                currency={currency}
              />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-outline-primary" onClick={onEdit}>
                Edit
              </button>
              <button className="btn btn-outline-danger" onClick={onDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Goal;
