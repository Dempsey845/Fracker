import React, { useState, useEffect } from "react";
import CustomForm from "../Components/CustomForm";
import Goal from "./Goal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";

const options = [
  { name: "name", type: "text" },
  { name: "start amount", type: "number" },
  { name: "target amount", type: "number" },
  { name: "note", type: "textarea" },
  { name: "target date", type: "date" },
];

const months = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => {
  const y = currentYear - i;
  return { name: y.toString(), value: y.toString() };
});

function Goals({ currency, onDataUpdated }) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (month) query.append("month", month);
    if (year) query.append("year", year);

    try {
      const res = await fetch(`/api/goals?${query}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setGoals(data.goals);
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [month, year]);

  const handleOnSubmit = async (e, formData) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData["target amount"]) {
      alert("Name and Target Amount are required!");
      return;
    }

    const goalData = {
      name: formData.name,
      startAmount: formData["start amount"],
      targetAmount: formData["target amount"],
      note: formData.note,
      targetDate: formData["target date"],
    };

    try {
      const res = await fetch("/api/creategoal", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      const data = await res.json();

      if (res.ok) {
        fetchGoals(); // Refresh list after creation
        onDataUpdated();
        closePopup();
        toast.success("Goal created successfully!");
      } else {
        console.error("Goal creation failed:", data.message);
        toast.error("Goal creation failed!");
      }
    } catch (err) {
      console.error("Error submitting goal:", err);
      toast.error("An error occurred while creating the goal.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
        toast.success("Goal deleted successfully!");
      } else {
        console.error("Failed to delete goal");
        toast.error("Goal deletion failed!");
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
      toast.error("An error occurred while deleting the goal.");
    }
  };

  const handleEdit = (id) => setEditingGoalId(id);

  const handleUpdate = async (goalId, formData) => {
    const goalData = {
      name: formData.name,
      startAmount: formData.start_amount,
      targetAmount: formData.target_amount,
      note: formData.note,
      targetDate: formData.target_date,
    };

    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Goal updated successfully:", data.goal);
        fetchGoals(); // Refresh list after update
        toast.success("Goal updated successfully!");
      } else {
        console.error("Failed to update goal:", data.message);
        toast.error("Goal update failed!");
      }
    } catch (err) {
      console.error("Error updating goal:", err);
      toast.error("An error occurred while updating the goal.");
    }
  };

  const openPopup = () => setShowGoalForm(true);
  const closePopup = () => setShowGoalForm(false);

  return (
    <div className="goals container py-4" style={containerStyles}>
      <h1>Goals</h1>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-select w-auto"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-select w-auto"
        >
          {years.map((y) => (
            <option key={y.value} value={y.value}>
              {y.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={openPopup} className="btn btn-primary mb-4">
        Create Goal
      </button>

      <CustomForm
        show={showGoalForm}
        title="Create Goal"
        formOptions={options}
        onClose={closePopup}
        onSubmit={handleOnSubmit}
      />

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <span className="ms-2">Loading goals...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-5 text-muted">No goals found.</div>
      ) : (
        <div className="row g-3">
          {goals.map((goal) => (
            <div key={goal.id} className="col-sm-6 col-md-4 col-lg-3">
              <Goal
                formData={goal}
                currency={currency}
                isEditing={editingGoalId === goal.id}
                onEdit={() => handleEdit(goal.id)}
                onDelete={() => handleDelete(goal.id)}
                onSave={(updated) => handleUpdate(goal.id, updated)}
                onCancel={() => setEditingGoalId(null)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}

const containerStyles = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "20px auto",
  maxWidth: "1200px",
};

export default Goals;
