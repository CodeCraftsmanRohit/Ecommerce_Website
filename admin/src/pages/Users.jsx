import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const Users = () => {
  const { backendUrl } = useContext(AdminContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/users-with-orders`, {
          withCredentials: true,
        });
        if (data.success) setUsers(data.users);
      } catch (err) {
        console.error("Failed to load users", err.message);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">All Users & Orders</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
             <div className="text-right">
  <p>
    <strong>Orders:</strong>{" "}
    <Link
      to={`/admin/user-orders/${user.id}`}
      className="text-blue-600 hover:underline"
    >
      {user.orderCount}
    </Link>
  </p>
  <p>
    <strong>Status:</strong>{" "}
    <span className="text-blue-600">{user.latestStatus}</span>
  </p>
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
