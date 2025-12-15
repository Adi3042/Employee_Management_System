// import React, { useState } from "react";
// import { UserIcon, MailIcon, EditIcon, TrashIcon } from "./Icons";

// const UserManagement = () => {
//   const [users] = useState([
//     {
//       id: 1,
//       name: "Sarah Wilson",
//       email: "sarah.wilson@company.com",
//       role: "manager",
//       status: "active",
//       joinDate: "2023-01-15"
//     },
//     {
//       id: 2,
//       name: "Michael Brown",
//       email: "michael.brown@company.com",
//       role: "manager",
//       status: "active",
//       joinDate: "2023-02-20"
//     },
//     {
//       id: 3,
//       name: "Alex Johnson",
//       email: "alex.johnson@company.com",
//       role: "employee",
//       status: "active",
//       joinDate: "2023-03-10"
//     },
//     {
//       id: 4,
//       name: "Mike Chen",
//       email: "mike.chen@company.com",
//       role: "employee",
//       status: "inactive",
//       joinDate: "2023-04-05"
//     }
//   ]);

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//       <div className="p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
//             <p className="text-gray-600">Manage all users in the system</p>
//           </div>
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//             Add User
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Join Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//                       <UserIcon className="w-5 h-5 text-indigo-600" />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                       <div className="text-sm text-gray-500 flex items-center">
//                         <MailIcon className="w-4 h-4 mr-1" />
//                         {user.email}
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     user.role === 'manager' 
//                       ? 'bg-purple-100 text-purple-800'
//                       : 'bg-blue-100 text-blue-800'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     user.status === 'active'
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.joinDate).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-2">
//                     <button className="text-indigo-600 hover:text-indigo-900">
//                       <EditIcon className="w-4 h-4" />
//                     </button>
//                     <button className="text-red-600 hover:text-red-900">
//                       <TrashIcon className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;

// Updated UserManagement.jsx with all admin features
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon, UserGroupIcon, MailIcon, EyeIcon, ShieldIcon, KeyIcon, UserIcon, ClipboardCheckIcon } from "./Icons";

const API_BASE = 'http://localhost:5000';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [managers, setManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAssignProjectModal, setShowAssignProjectModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  
  // Form states
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    position: ""
  });
  
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    position: "",
    is_active: true
  });
  
  const [reassignmentData, setReassignmentData] = useState({
    newManagerId: "",
    action: "reassign"
  });
  
  const [assignProjectData, setAssignProjectData] = useState({
    projectId: "",
    employeeId: "",
    priority: "medium",
    deadline: ""
  });
  
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchManagers(),
        fetchProjects()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/users/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const managersList = data.filter(user => user.role === 'manager' && user.is_active !== false);
        setManagers(managersList);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term) ||
        user.department?.toLowerCase().includes(term) ||
        user.position?.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`User ${newUser.name} created successfully as ${newUser.role}!`);
        setShowCreateModal(false);
        setNewUser({ 
          name: "", 
          email: "", 
          password: "", 
          role: "employee",
          department: "",
          position: ""
        });
        fetchAllData();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUser)
      });
      
      if (response.ok) {
        alert('User updated successfully!');
        setShowEditModal(false);
        fetchAllData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.requires_reassignment) {
          // Show reassignment modal for managers with team
          setSelectedUser({ ...selectedUser, ...data });
          setShowReassignModal(true);
        } else {
          alert('User deactivated successfully!');
          setShowDeleteModal(false);
          fetchAllData();
        }
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleReassignTeam = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/xapi/admin/managers/${selectedUser.manager_id}/reassign-team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reassignmentData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Team reassigned successfully!');
        setShowReassignModal(false);
        setSelectedUser(null);
        setReassignmentData({ newManagerId: "", action: "reassign" });
        fetchAllData();
      } else {
        alert(data.error || 'Failed to reassign team');
      }
    } catch (error) {
      console.error('Error reassigning team:', error);
      alert('Failed to reassign team');
    }
  };

  const handleChangeManager = async (employeeId, newManagerId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/manager/employees/${employeeId}/change-manager`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new_manager_id: newManagerId })
      });
      
      if (response.ok) {
        alert('Manager changed successfully!');
        fetchAllData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to change manager');
      }
    } catch (error) {
      console.error('Error changing manager:', error);
      alert('Failed to change manager');
    }
  };

  const handleAssignProject = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/manager/projects/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: assignProjectData.projectId,
          employee_id: assignProjectData.employeeId,
          priority: assignProjectData.priority,
          deadline: assignProjectData.deadline
        })
      });
      
      if (response.ok) {
        alert('Project assigned successfully!');
        setShowAssignProjectModal(false);
        setAssignProjectData({
          projectId: "",
          employeeId: "",
          priority: "medium",
          deadline: ""
        });
        fetchAllData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign project');
      }
    } catch (error) {
      console.error('Error assigning project:', error);
      alert('Failed to assign project');
    }
  };

  const handleResetPassword = async () => {
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          new_password: resetPasswordData.newPassword
        })
      });
      
      if (response.ok) {
        alert('Password reset successfully!');
        setShowResetPasswordModal(false);
        setResetPasswordData({
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Full control over users, roles, and permissions</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add User
          </button>
          <button
            onClick={() => fetchAllData()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, department, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="employee">Employees</option>
          <option value="manager">Managers</option>
          <option value="admin">Admins</option>
        </select>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => {
            const status = e.target.value;
            if (status === "all") {
              filterUsers();
            } else {
              const filtered = users.filter(user => 
                (status === "active" ? user.is_active : !user.is_active)
              );
              setFilteredUsers(filtered);
            }
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MailIcon className="w-4 h-4 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.is_active)}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.manager_name || 'N/A'}
                    {user.role === 'employee' && user.manager_id && (
                      <button
                        onClick={() => {
                          const newManagerId = prompt('Enter new manager ID:');
                          if (newManagerId && newManagerId !== user.manager_id) {
                            handleChangeManager(user.id, newManagerId);
                          }
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-900 text-xs"
                      >
                        Change
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {/* View Details */}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          alert(`
                            User Details:
                            Name: ${user.name}
                            Email: ${user.email}
                            Role: ${user.role}
                            Status: ${user.is_active ? 'Active' : 'Inactive'}
                            Department: ${user.department || 'N/A'}
                            Position: ${user.position || 'N/A'}
                            Manager: ${user.manager_name || 'N/A'}
                            Created: ${formatDate(user.created_at)}
                            Last Login: ${formatDate(user.last_login)}
                          `);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      
                      {/* Edit User */}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setEditUser({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            department: user.department || '',
                            position: user.position || '',
                            is_active: user.is_active
                          });
                          setShowEditModal(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit User"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      
                      {/* Delete User */}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      
                      {/* Reset Password */}
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowResetPasswordModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Reset Password"
                      >
                        <KeyIcon className="w-5 h-5" />
                      </button>
                      
                      {/* Assign Project (for employees) */}
                      {user.role === 'employee' && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setAssignProjectData({
                              ...assignProjectData,
                              employeeId: user.id
                            });
                            setShowAssignProjectModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Assign Project"
                        >
                          <ClipboardCheckIcon className="w-5 h-5" />
                        </button>
                      )}
                      
                      {/* Change Manager (for employees) */}
                      {user.role === 'employee' && user.manager_id && (
                        <button
                          onClick={() => {
                            const newManagerId = prompt('Enter new manager ID:');
                            if (newManagerId) {
                              handleChangeManager(user.id, newManagerId);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Change Manager"
                        >
                          <UserGroupIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No users found. Try changing your search filters.
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create New User</h3>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="john@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="At least 8 characters"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must contain letters and numbers</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Engineering"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={newUser.position}
                    onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Edit User: {selectedUser.name}</h3>
              
              <form onSubmit={handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editUser.is_active}
                    onChange={(e) => setEditUser({...editUser, is_active: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={editUser.department}
                    onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={editUser.position}
                    onChange={(e) => setEditUser({...editUser, position: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedUser.role === 'manager' ? 'Deactivate Manager' : 'Deactivate User'}
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to deactivate <strong>{selectedUser.name}</strong>?
                {selectedUser.role === 'manager' && ' This manager has team members that need to be reassigned.'}
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {selectedUser.role === 'manager' ? 'Deactivate Manager' : 'Deactivate User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Reassignment Modal */}
      {showReassignModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reassign Team</h3>
              <p className="text-gray-600 mb-4">
                Manager <strong>{selectedUser.name}</strong> has {selectedUser.team_size} team members.
                Choose how to handle them:
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to another manager:
                  </label>
                  <select
                    value={reassignmentData.newManagerId}
                    onChange={(e) => setReassignmentData({...reassignmentData, newManagerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a manager...</option>
                    {managers
                      .filter(m => m.id !== selectedUser.manager_id && m.is_active !== false)
                      .map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name} ({manager.email})
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReassignModal(false);
                    setSelectedUser(null);
                    setReassignmentData({ newManagerId: "", action: "reassign" });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReassignTeam}
                  disabled={!reassignmentData.newManagerId}
                  className={`px-4 py-2 rounded-lg ${
                    !reassignmentData.newManagerId
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Reassign Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Project Modal */}
      {showAssignProjectModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assign Project to {selectedUser.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
                  <select
                    value={assignProjectData.projectId}
                    onChange={(e) => setAssignProjectData({...assignProjectData, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title} - {project.status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={assignProjectData.priority}
                    onChange={(e) => setAssignProjectData({...assignProjectData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={assignProjectData.deadline}
                    onChange={(e) => setAssignProjectData({...assignProjectData, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => {
                    setShowAssignProjectModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignProject}
                  disabled={!assignProjectData.projectId}
                  className={`px-4 py-2 rounded-lg ${
                    !assignProjectData.projectId
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Assign Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Reset Password for {selectedUser.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={resetPasswordData.confirmPassword}
                    onChange={(e) => setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setSelectedUser(null);
                    setResetPasswordData({ newPassword: "", confirmPassword: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;