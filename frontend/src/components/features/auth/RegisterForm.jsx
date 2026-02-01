import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Label } from '../../common/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../common/Card';
import { ChevronRight, ChevronLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Step 1: Common
    fullName: '',
    email: '',
    password: '',
    role: 'student', // Default
    
    // Step 2: Student
    collegeName: '',
    studentId: '',
    fieldOfStudy: '',
    graduationYear: '',
    skills: '', // Comma separated
    cv: null, // File object

    // Step 2: Company
    companyName: '',
    registrationNumber: '',
    industryType: '',
    companySize: '',
    websiteUrl: '',
    companyDescription: '',
    contactPerson: '',
    businessLicense: null, // File object
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: files ? files[0] : value 
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.role === 'student') {
      if (!formData.collegeName) newErrors.collegeName = 'College Name is required';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
      if (!formData.fieldOfStudy) newErrors.fieldOfStudy = 'Field of Study is required';
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation Year is required';
    } else {
      if (!formData.companyName) newErrors.companyName = 'Company Name is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration Number is required';
      if (!formData.industryType) newErrors.industryType = 'Industry Type is required';
      if (!formData.contactPerson) newErrors.contactPerson = 'Contact Person is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Prepare payload for backend
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'student') {
        payload.name = formData.fullName;
        payload.collegeId = formData.studentId;
        payload.branch = formData.fieldOfStudy;
        payload.graduationYear = parseInt(formData.graduationYear);
        payload.skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        // Note: Real file upload would require FormData and a different API endpoint or handling
        // For now, sending filename as string to match schema type
        payload.resume = formData.cv ? formData.cv.name : ''; 
      } else {
        // Company
        payload.name = formData.companyName; // Main user name becomes Company Name
        payload.companyDetails = {
          registrationNumber: formData.registrationNumber,
          industryType: formData.industryType,
          companySize: formData.companySize,
          websiteUrl: formData.websiteUrl,
          description: formData.companyDescription,
          contactPerson: formData.contactPerson || formData.fullName
        };
      }

      console.log("Sending Register Payload:", payload);
      await register(payload);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Registration failed';
      setErrors({ submit: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          {step === 1 ? 'Basic Information' : formData.role === 'student' ? 'Student Profile' : 'Company Details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <select
                  id="role"
                  name="role"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="company">Company / Recruiter</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && formData.role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collegeName">University / College Name</Label>
                <Input
                  id="collegeName"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  className={errors.collegeName ? 'border-red-500' : ''}
                />
                {errors.collegeName && <p className="text-xs text-red-500">{errors.collegeName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID Number</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={errors.studentId ? 'border-red-500' : ''}
                />
                {errors.studentId && <p className="text-xs text-red-500">{errors.studentId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study / Major</Label>
                <Input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  className={errors.fieldOfStudy ? 'border-red-500' : ''}
                />
                {errors.fieldOfStudy && <p className="text-xs text-red-500">{errors.fieldOfStudy}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className={errors.graduationYear ? 'border-red-500' : ''}
                />
                {errors.graduationYear && <p className="text-xs text-red-500">{errors.graduationYear}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="skills">Skills (Comma separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="React, Node.js, Python..."
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="cv">Upload CV / Resume</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Click to upload or drag and drop</span>
                  <input 
                    type="file" 
                    id="cv" 
                    name="cv"
                    className="hidden" 
                    onChange={handleChange}
                  />
                  {formData.cv && <span className="text-sm text-blue-600 mt-2">{formData.cv.name}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && formData.role === 'company' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className={errors.registrationNumber ? 'border-red-500' : ''}
                />
                {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industryType">Industry Type</Label>
                <select
                  id="industryType"
                  name="industryType"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  value={formData.industryType}
                  onChange={handleChange}
                >
                  <option value="">Select Industry</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
                 {errors.industryType && <p className="text-xs text-red-500">{errors.industryType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <select
                  id="companySize"
                  name="companySize"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-1000">201-1000 Employees</option>
                  <option value="1000+">1000+ Employees</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  placeholder="https://..."
                  value={formData.websiteUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person Name</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={errors.contactPerson ? 'border-red-500' : ''}
                />
                 {errors.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson}</p>}
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <textarea
                  id="companyDescription"
                  name="companyDescription"
                  className="w-full min-h-[80px] p-3 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Tell us about your company..."
                  value={formData.companyDescription}
                  onChange={handleChange}
                />
              </div>

               <div className="col-span-2 space-y-2">
                <Label htmlFor="businessLicense">Upload Verification Docs (License / Tax ID)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Click to upload or drag and drop</span>
                   <input 
                    type="file" 
                    id="businessLicense" 
                    name="businessLicense"
                    className="hidden" 
                    onChange={handleChange}
                  />
                  {formData.businessLicense && <span className="text-sm text-blue-600 mt-2">{formData.businessLicense.name}</span>}
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <div className="w-full flex justify-end">
             <Button onClick={handleNext} className="w-full md:w-auto">
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Complete Registration <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
