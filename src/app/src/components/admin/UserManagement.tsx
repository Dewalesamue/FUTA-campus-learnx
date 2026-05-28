import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface UserManagementProps {
  userRole: 'student' | 'lecturer';
}

export function UserManagement({ userRole }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [userRole]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsersByRole(userRole);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: User['status']) => {
    try {
      setActionLoading(userId);
      await adminService.updateUserStatus(userId, status);
      await loadUsers(); // Reload data
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(userId);
      await adminService.deleteUser(userId);
      await loadUsers(); // Reload data
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500 text-white">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAvatarImage = (role: User['role']) => {
    switch (role) {
      case 'lecturer':
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
      case 'student':
        return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100";
      default:
        return undefined;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message={`Loading ${userRole}s...`} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-futa-gray-900 capitalize">{userRole} Management</h2>
          <p className="text-futa-gray-600">Manage {userRole} accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 text-futa-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder={`Search ${userRole}s...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Total {userRole}s</p>
                  <p className="text-2xl font-bold text-futa-gray-900">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-futa-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.status === 'suspended').length}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All {userRole}s ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-4 border border-futa-gray-200 rounded-lg hover:bg-futa-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={getAvatarImage(user.role)} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-futa-gray-900">{user.name}</h3>
                      <p className="text-sm text-futa-gray-600">{user.email}</p>
                      {user.studentId && (
                        <p className="text-xs text-futa-gray-500">ID: {user.studentId}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-futa-gray-600">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      {user.lastLogin && (
                        <p className="text-xs text-futa-gray-500">
                          Last seen {new Date(user.lastLogin).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {getStatusBadge(user.status)}
                    
                    <div className="flex items-center space-x-2">
                      {actionLoading === user.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          {user.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          
                          {user.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Suspend
                            </Button>
                          )}
                          
                          {user.status === 'suspended' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Reactivate
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-futa-gray-400 mx-auto mb-4" />
                <p className="text-futa-gray-600">No {userRole}s found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}