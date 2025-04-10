// real data
import { useEffect, useState } from "react";
import { Trash2, ToggleLeft, ToggleRight, LayoutDashboard } from "lucide-react";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const res = await fetch(`http://localhost:5000/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, is_active: newStatus } : user
          )
        );
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Toggle Error:", err);
      alert("Network error.");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    if (showDashboard) fetchUsers();
  }, [showDashboard]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => setShowDashboard((prev) => !prev)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-4 shadow"
      >
        <LayoutDashboard size={20} />
        {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
      </button>

      {showDashboard && (
        <div className="overflow-x-auto rounded  border-1 border-black-200 transition-all duration-300">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No users found 👀
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-4">
                          {user.id !== 6 && user.id !== 17 && (
                            <button
                              onClick={() =>
                                toggleUserStatus(user.id, user.is_active)
                              }
                              className={`p-2 rounded-full ${
                                user.is_active
                                  ? " text-green-600 "
                                  : " text-yellow-600"
                              }`}
                              title={user.is_active ? "Deactivate" : "Activate"}
                            >
                              {user.is_active ? (
                                <ToggleRight size={20} />
                              ) : (
                                <ToggleLeft size={20} />
                              )}
                            </button>
                          )}

                          {user.id !== 6 && user.id !== 17 && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-red-600 rounded-full"
                              title="Delete User"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
