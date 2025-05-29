import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaImages, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalGalleryImages: 0,
    totalContacts: 0,
    unreadContacts: 0,
    completedProjects: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Use mock data instead of fetching from the server
        const mockGalleryData = [
          { _id: '1', title: 'Image 1' },
          { _id: '2', title: 'Image 2' },
          { _id: '3', title: 'Image 3' },
          { _id: '4', title: 'Image 4' },
          { _id: '5', title: 'Image 5' }
        ];

        const mockContactsData = [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello, I would like to inquire about your services.',
            isRead: true,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            message: 'I am interested in your portfolio. Can we schedule a call?',
            isRead: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            message: 'Your work is amazing! I would like to collaborate.',
            isRead: false,
            createdAt: new Date().toISOString()
          }
        ];

        const mockProjectsData = [
          { _id: '1', title: 'Project 1', completed: true },
          { _id: '2', title: 'Project 2', completed: true },
          { _id: '3', title: 'Project 3', completed: false },
          { _id: '4', title: 'Project 4', completed: false }
        ];

        const unreadContacts = mockContactsData.filter(contact => !contact.isRead);
        const completedProjects = mockProjectsData.filter(project => project.completed);

        setStats({
          totalGalleryImages: mockGalleryData.length,
          totalContacts: mockContactsData.length,
          unreadContacts: unreadContacts.length,
          completedProjects: completedProjects.length
        });

        // Set recent contacts (latest 5)
        setRecentContacts(mockContactsData);

      } catch (err) {
        console.error('Error setting up dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Welcome back, {user?.name || 'Admin'}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
              <FaImages className="text-purple-600 dark:text-purple-300 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gallery Images</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.totalGalleryImages}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <FaEnvelope className="text-blue-600 dark:text-blue-300 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Contacts</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.totalContacts}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
              <FaExclamationCircle className="text-yellow-600 dark:text-yellow-300 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.unreadContacts}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <FaCheckCircle className="text-green-600 dark:text-green-300 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Projects</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats.completedProjects}</p>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Contacts</h2>

          {recentContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Message
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contact.isRead
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {contact.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent contacts found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
