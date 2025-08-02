import React, { useState } from 'react';
import { useTickets } from '../../contexts/TicketContext';
import { User, Edit, Trash2, Shield, UserCheck, Users } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { users, updateUser, deleteUser } = useTickets();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', role: '' });

  const handleEditUser = (user: any) => {
    setEditingUser(user.id);
    setEditData({ name: user.name, role: user.role });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      updateUser(editingUser, editData);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'support_agent': return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'end_user': return <User className="h-4 w-4 text-green-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin': return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'support_agent': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'end_user': return `${baseClasses} bg-green-100 text-green-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    support_agent: users.filter(u => u.role === 'support_agent').length,
    end_user: users.filter(u => u.role === 'end_user').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-700">Administrators</p>
              <p className="text-2xl font-bold text-purple-900">{roleStats.admin}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-700">Support Agents</p>
              <p className="text-2xl font-bold text-blue-900">{roleStats.support_agent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-700">End Users</p>
              <p className="text-2xl font-bold text-green-900">{roleStats.end_user}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        )}
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser === user.id ? (
                      <select
                        value={editData.role}
                        onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="end_user">End User</option>
                        <option value="support_agent">Support Agent</option>
                        <option value="admin">Administrator</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className={getRoleBadge(user.role)}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUser === user.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSaveUser}
                          className="text-green-600 hover:text-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-600 hover:text-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;