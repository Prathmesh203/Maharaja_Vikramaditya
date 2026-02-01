import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { driveService } from '../../services/api'; // We might need a getDriveById method
import { Briefcase, Calendar, MapPin, DollarSign, BookOpen, ChevronLeft, Loader } from 'lucide-react';

const DriveDetails = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We need to implement getDriveById in api.js first or use existing getCompanyDrives and filter?
    // Better to fetch specific drive. 
    // Wait, getCompanyDrives returns all drives. We can use that for now if we don't have a specific endpoint,
    // or we can implement getDriveById.
    // Looking at backend drive.controller.js, there is NO getDriveById exposed for company specifically, 
    // but there is generic getDrives (for students).
    // Let's assume we can fetch it or filter from the list if we have to, but proper way is an endpoint.
    // For now, let's try to fetch all and find it, or just implement the endpoint.
    // Actually, let's implement the endpoint in backend first to be clean.
    fetchDrive();
  }, [driveId]);

  const fetchDrive = async () => {
    try {
        // Temporary: We will use the student endpoint or company endpoint to find it.
        // Actually, looking at backend, we don't have a single drive fetch for company.
        // Let's implement it in backend quickly or just filter from company drives.
        // Filtering is safer for now without touching backend too much if not needed.
        const response = await driveService.getCompanyDrives();
        const foundDrive = response.data.find(d => d._id === driveId);
        if (foundDrive) {
            setDrive(foundDrive);
        } else {
            setError('Drive not found');
        }
        setLoading(false);
    } catch (err) {
      setError('Failed to load drive details');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  if (error || !drive) return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-red-600">{error || 'Drive not found'}</h3>
      <button onClick={() => navigate('/company/drives')} className="text-blue-600 mt-4 hover:underline">
        Back to Drives
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/company/drives')}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Drives
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{drive.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    drive.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {drive.status === 'active' ? 'Active' : 'Closed'}
                </span>
                <span className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    Posted: {new Date(drive.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {/* Action Buttons could go here */}
          </div>
        </div>

        <div className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Job Details
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-900">Salary:</span> {drive.salary}</p>
                        <p><span className="font-medium text-gray-900">Batch:</span> {drive.batchYear}</p>
                        <p><span className="font-medium text-gray-900">Eligibility:</span> {drive.cgpaCutoff} CGPA</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Important Dates
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-900">Application Deadline:</span> {new Date(drive.deadline).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-900">Test Date:</span> {drive.testDate ? new Date(drive.testDate).toLocaleDateString() : 'TBD'}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Description
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                    {drive.description}
                </div>
            </div>

            {drive.skills && drive.skills.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {drive.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
