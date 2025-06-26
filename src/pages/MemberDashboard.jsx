import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTasks, updateTask } from '../features/task/taskSlice';
import { ToastContainer } from 'react-toastify';

const MemberDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch, refresh]);

  const handleComplete = (id) => {
    dispatch(updateTask({ id, status: 'completed' })).then(triggerRefresh);
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <h1 className="mb-4">Welcome, {user?.user?.name}</h1>

      <h3 className="mb-4">Your Tasks</h3>

      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="alert alert-warning">No tasks assigned.</div>
      ) : (
        <div className="row">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">{task.description}</p>
                    <span
                      className={`badge ${
                        task.status === 'completed'
                          ? 'bg-success'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleComplete(task._id)}
                      className="btn btn-primary mt-3"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
