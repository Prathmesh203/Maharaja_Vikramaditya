import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';

export default function CompanyProfile() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    websiteUrl: user?.companyDetails?.websiteUrl || '',
    contactPerson: user?.companyDetails?.contactPerson || '',
    industryType: user?.companyDetails?.industryType || '',
    description: user?.companyDetails?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map flat form data to nested companyDetails structure expected by backend
      const updateData = {
          name: formData.name,
          companyDetails: {
              websiteUrl: formData.websiteUrl,
              contactPerson: formData.contactPerson,
              industryType: formData.industryType,
              description: formData.description
          }
      };
      
      await updateUser(updateData);
      alert("Company profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-slate-500">Manage your company details and branding.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="company-profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Input
                        id="industryType"
                        name="industryType"
                        value={formData.industryType}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactPerson">HR Contact Person</Label>
                    <Input
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full min-h-[100px] p-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.description}
                  onChange={handleChange}
                />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" form="company-profile-form" isLoading={isLoading}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
