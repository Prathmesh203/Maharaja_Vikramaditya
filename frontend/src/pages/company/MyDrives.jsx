import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driveService } from '../../services/api';
import { Briefcase, Users, Calendar, ArrowRight, Loader } from 'lucide-react';

const MyDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await driveService.getCompanyDrives();
      setDrives(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load drives');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Recruitment Drives</h1>
          <p className="text-gray-600">Manage your active and past job postings</p>
        </div>
        <button
          onClick={() => navigate('/company/create-drive')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          Post New Drive
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {drives.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No drives posted yet</h3>
          <p className="text-gray-500 mb-6">Start your first recruitment drive today</p>
          <button
            onClick={() => navigate('/company/create-drive')}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Create your first drive
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drives.map((drive) => (
            <div
              key={drive._id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{drive.title}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    drive.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {drive.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{drive.applicantCount || 0} Applicants</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/company/drives/${drive._id}`)}
                  className="flex-1 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => navigate(`/company/drives/${drive._id}/applicants`)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  Applicants
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDrives;
