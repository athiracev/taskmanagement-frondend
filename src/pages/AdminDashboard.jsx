import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  deleteTask,
  updateTask,
  createTask,
} from "../features/task/taskSlice";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, refresh]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const membersOnly = res.data.filter((u) => u.role === "member");
      setMembers(membersOnly);
    } catch (err) {
      console.error("Failed to load members");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createTask(formData)).then(triggerRefresh);
    setFormData({ title: "", description: "", assignedTo: "" });
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Task Creation */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Create Task</h4>
          <form onSubmit={handleCreate}>
            <div className="mb-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Assign to</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </form>
        </div>
      </div>

      {/* Task List */}
      <h4 className="mb-3">All Tasks</h4>
      {loading ? (
        <div className="alert alert-info">Loading tasks...</div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">{task.description}</p>
                    <p className="card-text text-muted">
                      Assigned to: {task.assignedTo?.name || "Unknown"}
                    </p>
                    <span
                      className={`badge mb-2 ${
                        task.status === "completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        dispatch(
                          updateTask({ id: task._id, status: "completed" })
                        ).then(triggerRefresh)
                      }
                      className="btn btn-success btn-sm"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() =>
                        dispatch(deleteTask(task._id)).then(triggerRefresh)
                      }
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
