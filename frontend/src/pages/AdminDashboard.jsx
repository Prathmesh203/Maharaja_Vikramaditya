import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CheckCircle, XCircle, Shield, Building2, User, Eye, RefreshCw } from 'lucide-react';
import { adminService } from '../services/api';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('companies');
  const [stats, setStats] = useState({ totalCompanies: 0, totalStudents: 0, pendingApprovals: 0 });
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminService.getStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const [companiesRes, studentsRes] = await Promise.all([
        adminService.getPendingUsers('company'),
        adminService.getPendingUsers('student')
      ]);
      setPendingCompanies(companiesRes.data);
      setPendingStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to fetch pending users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPending();
  }, []);

  const handleStatusUpdate = async (id, status, type) => {
    try {
      await adminService.updateUserStatus(id, status);
      // Optimistic update
      if (type === 'company') {
        setPendingCompanies(prev => prev.filter(c => c._id !== id));
      } else {
        setPendingStudents(prev => prev.filter(s => s._id !== id));
      }
      fetchStats(); // Refresh stats
      alert(`User ${status} successfully`);
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Manage system approvals and user access.</p>
        </div>
        <Button variant="outline" onClick={() => { fetchStats(); fetchPending(); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-slate-500">Action required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-slate-500">Active on platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-slate-500">Registered this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Pending Approvals */}
      <div className="bg-white p-1 rounded-lg border inline-flex gap-1 mb-4">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'companies' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Pending Companies ({pendingCompanies.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'students' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Pending Students ({pendingStudents.length})
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'companies' ? 'Company Registration Requests' : 'Student Profile Approvals'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="text-center py-4">Loading pending requests...</div>
          ) : (
            <div className="space-y-4">
                {activeTab === 'companies' && (
                pendingCompanies.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No pending company approvals.</p>
                ) : (
                    pendingCompanies.map(company => (
                    <div key={company._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                        <div>
                        <h4 className="font-semibold text-lg">{company.name}</h4>
                        <div className="text-sm text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                            <span>Reg No: {company.companyDetails?.registrationNumber || 'N/A'}</span>
                            <span>Type: {company.companyDetails?.industryType || 'N/A'}</span>
                            <span>Email: {company.email}</span>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            <Eye className="h-4 w-4 mr-2" /> View Docs
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                            onClick={() => handleStatusUpdate(company._id, 'approved', 'company')}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </Button>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1 md:flex-none"
                            onClick={() => handleStatusUpdate(company._id, 'rejected', 'company')}
                        >
                            <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                        </div>
                    </div>
                    ))
                )
                )}

                {activeTab === 'students' && (
                pendingStudents.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No pending student approvals.</p>
                ) : (
                    pendingStudents.map(student => (
                    <div key={student._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                        <div>
                        <h4 className="font-semibold text-lg">{student.name}</h4>
                        <div className="text-sm text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                            <span>ID: {student.collegeId || 'N/A'}</span>
                            <span>Branch: {student.branch || 'N/A'}</span>
                            <span>CGPA: {student.cgpa || 'N/A'}</span>
                        </div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                            View Profile
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
                            onClick={() => handleStatusUpdate(student._id, 'approved', 'student')}
                        >
                            Approve
                        </Button>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1 md:flex-none"
                            onClick={() => handleStatusUpdate(student._id, 'rejected', 'student')}
                        >
                            Reject
                        </Button>
                        </div>
                    </div>
                    ))
                )
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
