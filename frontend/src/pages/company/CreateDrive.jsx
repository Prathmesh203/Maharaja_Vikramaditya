import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import { Button } from '../../components/common/Button';
import { driveService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateDrive() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    batchYear: '',
    cgpaCutoff: '',
    skills: '',
    salary: '',
    deadline: '',
    testDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await driveService.createDrive(formData);
      alert("Drive created successfully!");
      navigate('/company/dashboard');
    } catch (error) {
      alert("Failed to create drive. Please check inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Post New Drive</h1>
        <p className="text-slate-500">Create a new job opportunity for students.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="create-drive-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer I"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full min-h-[100px] p-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="batchYear">Target Batch Year</Label>
                    <Input
                        id="batchYear"
                        name="batchYear"
                        type="number"
                        value={formData.batchYear}
                        onChange={handleChange}
                        required
                        placeholder="2024"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cgpaCutoff">Min CGPA Cutoff</Label>
                    <Input
                        id="cgpaCutoff"
                        name="cgpaCutoff"
                        type="number"
                        step="0.01"
                        value={formData.cgpaCutoff}
                        onChange={handleChange}
                        required
                        placeholder="7.5"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salary">Salary Package (LPA)</Label>
                    <Input
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                        placeholder="10-12 LPA"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills (Comma separated)</Label>
                    <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                        placeholder="Java, React, SQL"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="testDate">Test Date</Label>
                    <Input
                        id="testDate"
                        name="testDate"
                        type="date"
                        value={formData.testDate}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => navigate('/company/dashboard')}>Cancel</Button>
            <Button type="submit" form="create-drive-form" isLoading={isLoading}>
                Create Drive
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
