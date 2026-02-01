import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Plus, Users, Briefcase, FileText } from 'lucide-react';
import { applicationService } from '../services/api';
import { Link } from 'react-router-dom';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalDrives: 0, totalApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await applicationService.getStats();
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, {user?.name}</h1>
          <p className="text-slate-500">Here's an overview of your recruitment activities.</p>
        </div>
        <div className="flex gap-2">
            <Link to="/company/create-drive">
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Job/Drive
                </Button>
            </Link>
            <Link to="/company/profile">
                 <Button variant="outline">Edit Profile</Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Live Drives</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalDrives}</div>
            <p className="text-xs text-slate-500">Active job postings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalApplications}</div>
            <p className="text-xs text-slate-500">Across all drives</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Placeholder for "My Drives" list could go here, reusing the getCompanyDrives API */}
    </div>
  );
}
