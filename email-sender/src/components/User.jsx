import { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState([]);

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
  const toggleUserStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/users/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: status }),
      });

      const data = await res.json();

      if (data.success) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, is_active: status } : user
          )
        );
      } else {
        alert(data.error || "Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Something went wrong");
    }
  };

  const deleteUser = async (id) => {
    console.log("Deleting user with ID:", id);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("DELETE Response:", data);

      if (data.success) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Error in deleteUser:", err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <div className="flex justify-between gap-3.5">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-5 py-1 rounded"
                  >
                    Delete
                  </button>
                  {user.is_active ? (
                    <button
                      onClick={() => toggleUserStatus(user.id, false)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleUserStatus(user.id, true)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
