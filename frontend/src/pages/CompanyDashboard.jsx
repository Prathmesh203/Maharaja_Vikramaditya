import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Plus, Users, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { applicationService, driveService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalDrives: 0, totalApplications: 0 });
  const [recentDrives, setRecentDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, drivesRes] = await Promise.all([
          applicationService.getStats(),
          driveService.getCompanyDrives()
        ]);
        setStats(statsRes.data);
        setRecentDrives(drivesRes.data.slice(0, 3)); // Get top 3
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user?.name}</h1>
          <p className="text-slate-500">Here's what's happening with your recruitment drives.</p>
        </div>
        <div className="flex gap-2">
            <Link to="/company/create-drive">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Post New Job
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Drives</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.totalDrives}</div>
            <p className="text-xs text-slate-500 mt-1">Active job postings</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{loading ? '...' : stats.totalApplications}</div>
            <p className="text-xs text-slate-500 mt-1">Candidates applied</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg. Applications</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
                {loading ? '...' : (stats.totalDrives ? Math.round(stats.totalApplications / stats.totalDrives) : 0)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Per drive</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Recent Drives</h2>
            <Link to="/company/drives" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
        {loading ? (
            <div className="text-center py-8 text-slate-500">Loading drives...</div>
        ) : recentDrives.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center">
                <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No drives yet</h3>
                <p className="text-gray-500 mb-4">Create your first job posting to get started</p>
                <Link to="/company/create-drive">
                    <Button variant="outline">Create Drive</Button>
                </Link>
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentDrives.map(drive => (
                    <Card key={drive._id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/company/drives/${drive._id}/applicants`)}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-semibold text-slate-900 line-clamp-1">{drive.title}</CardTitle>
                                <span className={`text-xs px-2 py-1 rounded-full ${drive.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {drive.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">Posted {new Date(drive.createdAt).toLocaleDateString()}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-slate-600">
                                    <span className="font-medium text-slate-900">{drive.applicantCount || 0}</span> Applicants
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0">
                                    Manage
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
