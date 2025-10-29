"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IncubationApplication } from "@/components/dashboard/incubation-form";
import { useIncubationApplications } from "@/hooks/useApi";
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Building2,
  Users,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Globe,
  Plus,
  Save,
  X,
  Loader2
} from "lucide-react";

// Use the IncubationApplication interface from the form component
export type IncubatedCompany = IncubationApplication;

// Sample incubated companies data based on actual application forms
const sampleCompanies: IncubatedCompany[] = [
  {
    id: "1",
    // Applicant Details
    applicantName: "Dr. Rajesh Kumar",
    applicantEmail: "rajesh@healthtechsolutions.com",
    dateOfBirth: "1985-06-15",
    qualification: "MBBS, MD Cardiology",
    contactDetails: "123 Medical College Road, Patna, Bihar - 800001, +91-9876543210, rajesh@healthtechsolutions.com",
    entityType: "startup",
    companyRegistrationDetails: "HealthTech Solutions Pvt Ltd, 123 Medical College Road, Patna, Bihar - 800001, Incorporated on 15th March 2023, DIPP Registration: DIPP123456789",
    
    // Innovation Details
    innovationTitle: "AI-Powered Cardiovascular Disease Detection Platform",
    prototypeTime: "6 months",
    category: "Product",
    innovationDescription: "Machine learning-based diagnostic platform for early detection of cardiovascular diseases using ECG analysis and patient data.",
    applications: "Hospitals, clinics, telemedicine platforms, rural healthcare centers",
    novelty: "Novel AI algorithm for ECG interpretation with 95% accuracy, no similar products in Indian market",
    businessModel: "SaaS subscription model with per-scan pricing for hospitals and clinics",
    rndStatus: "Completed proof-of-concept, currently in clinical validation phase",
    trlStatus: "TRL 6 - System prototype demonstration in operational environment",
    
    // Team & IP
    teamMembers: "Dr. Rajesh Kumar (CEO), Dr. Priya Singh (CTO), 3 software developers, 2 clinical advisors",
    patents: "Patent application filed for AI algorithm (Application No: 202341012345)",
    awards: "Winner of AIIMS Patna Innovation Challenge 2023",
    
    // Incubation Requirements
    requestedPeriod: "18 months",
    spaceRequested: "2 desks, 100 sq.ft lab space",
    equipmentRequired: "High-performance computing setup, ECG simulation equipment",
    otherIncubator: "No",
    
    // Compliance & Ethics
    clinicalSamples: "Yes - ECG data from patients (anonymized)",
    biosafetyClearance: "No",
    employeesOnsite: 3,
    
    // Financials & Support
    fundRaised: "₹15 Lakhs from angel investors",
    annualTurnover: "₹0 (pre-revenue)",
    incubationHelp: "Clinical validation support, regulatory guidance, market access",
    documents: "Business plan, technical specifications, financial projections, team CVs",
    
    // Pre-incubation specific
    isStudent: false,
    ideationMentorship: false,
    labAccess: false,
    prototypeSupport: false,
    businessPlanning: false,
    ecosystemExposure: false,
    
    // Additional Information
    priorFunding: true,
    fundingDetails: "Angel investment of ₹15 Lakhs",
    collaborationRequired: true,
    collaborationDept: "Cardiology, Clinical Trials",
    futureVision: "To become the leading AI-powered diagnostic platform in India and expand globally",
    
    // Application Status
    applicationType: "incubation",
    applicationStatus: "incubated",
    submittedAt: "2023-05-01T00:00:00Z",
    reviewedAt: "2023-05-15T00:00:00Z",
    approvedAt: "2023-05-20T00:00:00Z",
    startDate: "2023-06-01",
    
    // Current Status
    currentStage: "incubation",
    status: "active",
    
    // Progress Tracking
    fundingReceived: 2500000,
    employees: 8,
    achievements: [
      "Secured ₹25 Lakhs seed funding",
      "Filed 2 patents for AI algorithms",
      "Completed clinical validation with 500+ patients"
    ],
    milestones: [
      "MVP Development",
      "Clinical Validation",
      "Regulatory Approval",
      "Market Launch"
    ],
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    // Applicant Details
    applicantName: "Priya Sharma",
    applicantEmail: "priya@medidevice.com",
    dateOfBirth: "1988-03-22",
    qualification: "B.Tech Electronics, M.Tech Biomedical Engineering",
    contactDetails: "456 Innovation Hub, Bangalore, Karnataka - 560001, +91-8765432109, priya@medidevice.com",
    entityType: "startup",
    companyRegistrationDetails: "MediDevice Technologies Pvt Ltd, 456 Innovation Hub, Bangalore, Karnataka - 560001, Incorporated on 10th January 2023, DIPP Registration: DIPP987654321",
    
    // Innovation Details
    innovationTitle: "Portable ECG Monitoring Device with AI Analysis",
    prototypeTime: "4 months",
    category: "Product",
    innovationDescription: "Compact, wireless ECG device with real-time AI-powered analysis for remote patient monitoring.",
    applications: "Home healthcare, rural clinics, ambulance services, telemedicine",
    novelty: "First portable ECG device with integrated AI analysis for Indian market",
    businessModel: "Device sales + subscription for AI analysis service",
    rndStatus: "Completed prototype development, in clinical trials phase",
    trlStatus: "TRL 7 - System prototype demonstration in operational environment",
    
    // Team & IP
    teamMembers: "Priya Sharma (CEO), Dr. Amit Kumar (Medical Advisor), 4 engineers, 2 clinical specialists",
    patents: "2 patents filed for device design and AI algorithm",
    awards: "Best Medical Device Innovation - Healthcare Innovation Summit 2022",
    
    // Incubation Requirements
    requestedPeriod: "24 months",
    spaceRequested: "3 desks, 200 sq.ft lab space",
    equipmentRequired: "Electronics lab setup, testing equipment, clinical trial support",
    otherIncubator: "No",
    
    // Compliance & Ethics
    clinicalSamples: "Yes - ECG data for validation",
    biosafetyClearance: "No",
    employeesOnsite: 5,
    
    // Financials & Support
    fundRaised: "₹30 Lakhs from government grants and private investors",
    annualTurnover: "₹50 Lakhs (2023)",
    incubationHelp: "Regulatory approval support, clinical trial guidance, manufacturing partnerships",
    documents: "Technical specifications, clinical trial data, regulatory documents",
    
    // Pre-incubation specific
    isStudent: false,
    ideationMentorship: false,
    labAccess: false,
    prototypeSupport: false,
    businessPlanning: false,
    ecosystemExposure: false,
    
    // Additional Information
    priorFunding: true,
    fundingDetails: "Government grants and private investors - ₹30 Lakhs",
    collaborationRequired: true,
    collaborationDept: "Electronics, Clinical Trials",
    futureVision: "To revolutionize remote healthcare monitoring across India and expand to global markets",
    
    // Application Status
    applicationType: "incubation",
    applicationStatus: "graduated",
    submittedAt: "2023-02-01T00:00:00Z",
    reviewedAt: "2023-02-15T00:00:00Z",
    approvedAt: "2023-02-20T00:00:00Z",
    startDate: "2023-03-15",
    endDate: "2024-03-15",
    
    // Current Status
    currentStage: "graduated",
    status: "graduated",
    
    // Progress Tracking
    fundingReceived: 5000000,
    employees: 15,
    achievements: [
      "Successfully graduated from incubation",
      "Raised Series A funding of ₹5 Crores",
      "Launched product in 3 states",
      "Created 15+ direct jobs"
    ],
    milestones: [
      "Prototype Development",
      "Clinical Trials",
      "Regulatory Approval",
      "Commercial Launch",
      "Graduation"
    ],
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z"
  },
  {
    id: "3",
    // Applicant Details
    applicantName: "Dr. Michael Chen",
    applicantEmail: "michael@biogen.com",
    dateOfBirth: "1990-11-08",
    qualification: "PhD Biotechnology, Post-doc Genomics",
    contactDetails: "789 Research Park, Hyderabad, Telangana - 500001, +91-7654321098, michael@biogen.com",
    entityType: "startup",
    companyRegistrationDetails: "BioGen Innovations Pvt Ltd, 789 Research Park, Hyderabad, Telangana - 500001, Incorporated on 20th February 2023, DIPP Registration: DIPP456789123",
    
    // Innovation Details
    innovationTitle: "Personalized Medicine Platform using Genomic Analysis",
    prototypeTime: "8 months",
    category: "Product",
    innovationDescription: "AI-powered platform for personalized treatment recommendations based on genomic analysis and clinical data.",
    applications: "Oncology treatment, rare diseases, pharmacogenomics",
    novelty: "First comprehensive genomic analysis platform for Indian population",
    businessModel: "B2B service to hospitals and clinics, per-analysis pricing",
    rndStatus: "Early research phase, building genomic database",
    trlStatus: "TRL 4 - Technology validated in lab environment",
    
    // Team & IP
    teamMembers: "Dr. Michael Chen (CEO), Dr. Sarah Johnson (CSO), 3 bioinformaticians, 2 clinical geneticists",
    patents: "Patent application in preparation",
    awards: "None yet",
    
    // Incubation Requirements
    requestedPeriod: "12 months",
    spaceRequested: "2 desks, 150 sq.ft lab space",
    equipmentRequired: "Computational resources, genomic analysis software",
    otherIncubator: "No",
    
    // Compliance & Ethics
    clinicalSamples: "Yes - genomic samples (with proper consent)",
    biosafetyClearance: "Yes - required for genomic sample handling",
    employeesOnsite: 2,
    
    // Financials & Support
    fundRaised: "₹5 Lakhs from university grants",
    annualTurnover: "₹0 (pre-revenue)",
    incubationHelp: "Research partnerships, clinical validation support, regulatory guidance",
    documents: "Research proposal, preliminary data, team credentials",
    
    // Pre-incubation specific
    isStudent: false,
    ideationMentorship: true,
    labAccess: true,
    prototypeSupport: true,
    businessPlanning: true,
    ecosystemExposure: true,
    
    // Additional Information
    priorFunding: true,
    fundingDetails: "University grants - ₹5 Lakhs",
    collaborationRequired: true,
    collaborationDept: "Genomics, Clinical Genetics, Oncology",
    futureVision: "To democratize personalized medicine in India and make genomic analysis accessible to all",
    
    // Application Status
    applicationType: "pre-incubation",
    applicationStatus: "incubated",
    submittedAt: "2023-12-01T00:00:00Z",
    reviewedAt: "2023-12-15T00:00:00Z",
    approvedAt: "2023-12-20T00:00:00Z",
    startDate: "2024-01-01",
    
    // Current Status
    currentStage: "pre-incubation",
    status: "active",
    
    // Progress Tracking
    fundingReceived: 1000000,
    employees: 5,
    achievements: [
      "Received pre-incubation funding of ₹10 Lakhs",
      "Established research partnerships with 2 hospitals",
      "Completed proof-of-concept studies"
    ],
    milestones: [
      "Research Validation",
      "Partnership Development",
      "Clinical Studies",
      "Regulatory Pathway"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  }
];

const stageLabels: Record<IncubatedCompany["currentStage"], string> = {
  "pre-incubation": "Pre-Incubation",
  "incubation": "Incubation",
  "graduated": "Graduated",
  "exited": "Exited"
};

const statusLabels: Record<IncubatedCompany["status"], string> = {
  "active": "Active",
  "inactive": "Inactive",
  "graduated": "Graduated",
  "exited": "Exited"
};

const applicationTypeLabels: Record<IncubatedCompany["applicationType"], string> = {
  "incubation": "Incubation",
  "pre-incubation": "Pre-Incubation"
};

const applicationStatusLabels: Record<IncubatedCompany["applicationStatus"], string> = {
  "submitted": "Submitted",
  "under-review": "Under Review",
  "approved": "Approved",
  "rejected": "Rejected",
  "incubated": "Incubated",
  "graduated": "Graduated",
  "exited": "Exited"
};

const stageColors: Record<IncubatedCompany["currentStage"], string> = {
  "pre-incubation": "bg-blue-100 text-blue-800",
  "incubation": "bg-green-100 text-green-800",
  "graduated": "bg-purple-100 text-purple-800",
  "exited": "bg-gray-100 text-gray-800"
};

const statusColors: Record<IncubatedCompany["status"], string> = {
  "active": "bg-green-100 text-green-800",
  "inactive": "bg-yellow-100 text-yellow-800",
  "graduated": "bg-purple-100 text-purple-800",
  "exited": "bg-gray-100 text-gray-800"
};

const applicationStatusColors: Record<IncubatedCompany["applicationStatus"], string> = {
  "submitted": "bg-gray-100 text-gray-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  "approved": "bg-green-100 text-green-800",
  "rejected": "bg-red-100 text-red-800",
  "incubated": "bg-blue-100 text-blue-800",
  "graduated": "bg-purple-100 text-purple-800",
  "exited": "bg-gray-100 text-gray-800"
};

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export default function IncubatedCompaniesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<IncubatedCompany["currentStage"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncubatedCompany["status"] | "all">("all");
  const [applicationTypeFilter, setApplicationTypeFilter] = useState<IncubatedCompany["applicationType"] | "all">("all");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<IncubatedCompany["applicationStatus"] | "all">("all");
  const [viewingCompany, setViewingCompany] = useState<IncubatedCompany | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    data: applicationsData,
    loading,
    error,
    fetchApplications,
    deleteApplication,
    fetchStats
  } = useIncubationApplications();

  // Fetch applications on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchTerm || undefined,
      applicationStatus: applicationStatusFilter !== "all" ? applicationStatusFilter : undefined,
      currentStage: stageFilter !== "all" ? stageFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    };
    
    fetchApplications(params);
  }, [currentPage, searchTerm, stageFilter, statusFilter, applicationStatusFilter]);

  // Get companies from API data
  const companies = applicationsData?.data?.applications || [];
  const pagination = applicationsData?.data?.pagination;



  const handleDeleteCompany = async (companyId: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteApplication(companyId);
        // Refresh the applications list
        const params = {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          applicationStatus: applicationStatusFilter !== "all" ? applicationStatusFilter : undefined,
          currentStage: stageFilter !== "all" ? stageFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy: 'submittedAt',
          sortOrder: 'desc'
        };
        fetchApplications(params);
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete application');
      }
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStats = () => {
    return {
      total: companies.length,
      active: companies.filter((c: IncubatedCompany) => c.status === "active").length,
      graduated: companies.filter((c: IncubatedCompany) => c.status === "graduated").length,
      exited: companies.filter((c: IncubatedCompany) => c.status === "exited").length,
      submitted: companies.filter((c: IncubatedCompany) => c.applicationStatus === "submitted").length,
      underReview: companies.filter((c: IncubatedCompany) => c.applicationStatus === "under-review").length,
      approved: companies.filter((c: IncubatedCompany) => c.applicationStatus === "approved").length,
      incubated: companies.filter((c: IncubatedCompany) => c.applicationStatus === "incubated").length,
      totalFunding: companies.reduce((sum: number, c: IncubatedCompany) => sum + (c.fundingReceived || 0), 0),
      totalEmployees: companies.reduce((sum: number, c: IncubatedCompany) => sum + (c.employees || 0), 0)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incubation Applications Management</h1>
          <p className="text-muted-foreground">
            Manage incubation and pre-incubation applications, track progress, and monitor company development.
          </p>
        </div>
        {/* <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.submitted} submitted, {stats.underReview} under review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Incubated</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.incubated}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active companies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successfully Graduated</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.graduated}</div>
            <p className="text-xs text-muted-foreground">
              {stats.exited} exited companies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Funding Facilitated</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalFunding)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees} jobs created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applicants, innovations, or applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select 
                value={applicationTypeFilter} 
                onChange={(e) => setApplicationTypeFilter(e.target.value as IncubatedCompany["applicationType"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Application Types</option>
                {Object.entries(applicationTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={applicationStatusFilter} 
                onChange={(e) => setApplicationStatusFilter(e.target.value as IncubatedCompany["applicationStatus"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Application Status</option>
                {Object.entries(applicationStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={stageFilter} 
                onChange={(e) => setStageFilter(e.target.value as IncubatedCompany["currentStage"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Current Stages</option>
                {Object.entries(stageLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as IncubatedCompany["status"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incubation Applications</CardTitle>
          <CardDescription>
            Manage and view all incubation applications in a tabular format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Company/Innovation</th>
                  <th className="text-left p-3 font-medium">Applicant</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Stage</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Applied Date</th>
                  <th className="text-left p-3 font-medium">Funding</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  companies.map((company: IncubatedCompany) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-sm">{company.innovationTitle}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {company.innovationDescription}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-sm">{company.applicantName}</div>
                        <div className="text-xs text-muted-foreground">{company.applicantEmail}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {applicationTypeLabels[company.applicationType]}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={stageColors[company.currentStage]}>
                        {stageLabels[company.currentStage]}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={applicationStatusColors[company.applicationStatus]}>
                        {applicationStatusLabels[company.applicationStatus]}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {formatDate(company.submittedAt)}
                    </td>
                    <td className="p-3 text-sm">
                      {company.fundingReceived ? formatCurrency(company.fundingReceived) : 'N/A'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingCompany(company)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCompany(company.id || '')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} applications
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {companies.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || stageFilter !== "all" || statusFilter !== "all" || applicationTypeFilter !== "all" || applicationStatusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first incubation application."}
            </p>
            {/* <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Application
            </Button> */}
          </CardContent>
        </Card>
      )}


      {/* Company Detail View Modal */}
      {viewingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Company Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setViewingCompany(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-8">
                {/* Applicant Details */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Applicant Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Applicant Name</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.applicantName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Applicant Email</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.applicantEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.dateOfBirth}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Professional Qualification</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.qualification}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Details (Address, Phone, Email, Website)</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.contactDetails}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Startup / Individual</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.entityType === "startup" ? "Startup" : "Individual"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Company Registration Details</label>
                    <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.companyRegistrationDetails}</p>
                  </div>
                </div>

                {/* Innovation Details */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Innovation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title of The Technology/Innovation</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.innovationTitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Time Required For Prototype Readiness</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.prototypeTime}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category Of Technology / Innovation</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.category}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Details Of Proposed Idea / Innovation</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[80px]">{viewingCompany.innovationDescription}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Potential Areas of Applications</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.applications}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Novelty & Freedom to Operate</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.novelty}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Projected Business Model</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.businessModel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current status of R&D and other technological inputs</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.rndStatus}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Development Status / TRL & Market Info</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.trlStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Team & IP */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Team & IP</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Team Members / Partners / Mentors</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[80px]">{viewingCompany.teamMembers}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Patents (if any)</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.patents || 'None'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Awards (if any)</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.awards || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incubation Requirements */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Incubation Requirements</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Requested Incubation Period</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.requestedPeriod}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Space Requested</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.spaceRequested}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Major Equipment Required</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.equipmentRequired}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Currently Incubated Elsewhere?</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.otherIncubator}</p>
                    </div>
                  </div>
                </div>

                {/* Compliance & Ethics */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Compliance & Ethics</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Use of clinical/animal/microbial samples?</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.clinicalSamples}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Biosafety / Ethical clearance required?</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.biosafetyClearance}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">No. of employees working onsite at CMIE</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.employeesOnsite}</p>
                    </div>
                  </div>
                </div>

                {/* Financials & Support */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Financials & Support</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Fund Raised Till Now</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.fundRaised}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Annual Turnover</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.annualTurnover}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Incubation Help You Expect From CMIE</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.incubationHelp}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">List of Documents attached</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[60px]">{viewingCompany.documents}</p>
                    </div>
                  </div>
                </div>

                {/* Pre-Incubation (Students / Early Ideas) */}
                {viewingCompany.applicationType === "pre-incubation" && (
                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-4">Pre-Incubation (Students / Early Ideas)</h3>
                    <p className="text-sm text-gray-600 mb-4">Tick if applicable</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.isStudent} readOnly className="w-4 h-4" />
                        <span className="text-sm">Student / Individual Innovator with concept stage idea</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.ideationMentorship} readOnly className="w-4 h-4" />
                        <span className="text-sm">Ideation Mentorship</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.labAccess} readOnly className="w-4 h-4" />
                        <span className="text-sm">Access to Lab Space & Instruments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.prototypeSupport} readOnly className="w-4 h-4" />
                        <span className="text-sm">Prototype Development Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.businessPlanning} readOnly className="w-4 h-4" />
                        <span className="text-sm">Mentoring & Business Planning</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={viewingCompany.ecosystemExposure} readOnly className="w-4 h-4" />
                        <span className="text-sm">Exposure to Startup Ecosystem</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Prior funding / grants?</label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={viewingCompany.priorFunding} readOnly className="w-4 h-4" />
                          <span className="text-sm">Yes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={!viewingCompany.priorFunding} readOnly className="w-4 h-4" />
                          <span className="text-sm">No</span>
                        </div>
                      </div>
                      {viewingCompany.priorFunding && (
                        <div className="mt-2">
                          <label className="text-sm font-medium text-gray-700">If yes, provide details</label>
                          <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.fundingDetails}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require collaboration with AIIMS Patna departments?</label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={viewingCompany.collaborationRequired} readOnly className="w-4 h-4" />
                          <span className="text-sm">Yes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked={!viewingCompany.collaborationRequired} readOnly className="w-4 h-4" />
                          <span className="text-sm">No</span>
                        </div>
                      </div>
                      {viewingCompany.collaborationRequired && (
                        <div className="mt-2">
                          <label className="text-sm font-medium text-gray-700">If yes, specify</label>
                          <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingCompany.collaborationDept}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Future Plans & Vision (100 words)</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[80px]">{viewingCompany.futureVision}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

