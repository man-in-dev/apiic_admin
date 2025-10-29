"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreIncubationForm, PreIncubationApplication } from "@/components/dashboard/pre-incubation-form";
import { usePreIncubationApplications } from "@/hooks/useApi";
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

// Use the PreIncubationApplication interface from the form component
export type PreIncubatedCompany = PreIncubationApplication;

// Sample pre-incubation companies data
const samplePreIncubationCompanies: PreIncubatedCompany[] = [
  {
    id: "1",
    // A. Applicant Details
    applicantName: "Dr. Sarah Johnson",
    applicantBackground: "CV_Sarah_Johnson.pdf",
    companyName: "MedInnovate Solutions",
    foundingTeam: [
      {
        name: "Dr. Sarah Johnson",
        address: "123 Medical College Road, Patna, Bihar - 800001",
        contact: "sarah@medinnovate.com, +91-9876543210"
      },
      {
        name: "Dr. Raj Patel",
        address: "456 Tech Park, Bangalore, Karnataka - 560001",
        contact: "raj@medinnovate.com, +91-8765432109"
      }
    ],
    shareholdingStructure: [
      {
        name: "Dr. Sarah Johnson",
        shares: 60,
        percentage: 60,
        designation: "Founder & CEO"
      },
      {
        name: "Dr. Raj Patel",
        shares: 40,
        percentage: 40,
        designation: "Co-founder & CTO"
      }
    ],
    partnershipDetails: "Equal partnership with shared decision making",
    hasFiledITReturn: true,
    registrationNo: "U72900BR2024PTC123456",
    registrationDate: "2024-01-15",
    registeringAuthority: "Registrar of Companies, Patna",
    pan: "ABCDE1234F",
    tan: "BPLM12345A",
    
    // B. Background
    problemAddressed: "Rare genetic diseases affect millions worldwide but lack effective treatments due to limited research and high development costs. Current drug discovery processes are time-consuming and expensive, making it difficult to develop treatments for rare diseases with small patient populations.",
    proposedSolution: "Our AI-powered platform uses machine learning algorithms to analyze genomic data and predict drug-target interactions, significantly reducing the time and cost of drug discovery for rare diseases. The platform can identify potential drug compounds 10x faster than traditional methods.",
    
    // C. Business Details
    productServiceDetails: "AI-powered drug discovery platform that uses machine learning to analyze genomic data and predict drug-target interactions for rare genetic diseases. The platform includes data visualization tools, predictive analytics, and integration with existing research databases.",
    targetCustomer: "Pharmaceutical companies, research institutions, rare disease foundations, academic researchers, and biotechnology companies focused on rare disease research.",
    businessPlan: "Phase 1: Develop and validate AI algorithms (6 months), Phase 2: Build platform and conduct pilot studies (6 months), Phase 3: Commercial launch and scale (12 months). Target 50+ customers in first year.",
    marketSize: "Global rare disease drug market is $150 billion and growing at 12% CAGR. Indian market represents $2.5 billion opportunity with 70 million people affected by rare diseases.",
    goToMarketStrategy: "Direct sales to pharmaceutical companies, partnerships with research institutions, freemium model for academic researchers, and strategic alliances with rare disease foundations.",
    revenueModel: "SaaS subscription model with tiered pricing: Basic ($500/month), Professional ($2000/month), Enterprise ($5000/month). Additional revenue from consulting services and data licensing.",
    competitors: "Major competitors include Atomwise, Benevolent AI, and Recursion Pharmaceuticals. Our advantage is specialization in rare diseases and lower cost structure for Indian market.",
    fundingInvestment: "Raised ₹2 Lakhs from university grants. Planning to raise ₹50 Lakhs in seed funding within 6 months for platform development and team expansion.",
    swotAnalysis: "Strengths: Strong technical team, clear market need, cost advantage. Weaknesses: Limited initial funding, small team. Opportunities: Growing rare disease awareness, government support for AI in healthcare. Threats: Competition from established players, regulatory challenges.",
    otherDetails: "Platform will be developed using cloud-native architecture with focus on scalability and security. Integration with existing research databases and compliance with data protection regulations.",
    
    // D. Scientific/Technological Details
    technologyCategory: "self-developed",
    technologyDetails: "Machine learning algorithms for genomic data analysis, natural language processing for literature mining, and predictive modeling for drug-target interactions. Technology stack includes Python, TensorFlow, and cloud computing infrastructure.",
    canBePatented: true,
    conductedPatentSearch: true,
    appliedForPatent: false,
    patentDetails: "Patent search completed, no conflicting patents found. Planning to file patent application for core algorithm within 3 months.",
    otherIPRProtection: "Trademark for company name and logo, copyright for software code, and trade secrets for proprietary algorithms.",
    
    // E. Incubation Requirement
    infrastructureFacilities: "High-performance computing setup, secure data storage, cloud computing resources, and access to research databases.",
    mentors: "Finance (fundraising and financial planning), Marketing (go-to-market strategy), Engineering (technical architecture and scalability)",
    manpower: "2 student interns for data collection and analysis, 1 part-time developer for platform development",
    
    // Application Status
    applicationType: "pre-incubation",
    applicationStatus: "incubated",
    submittedAt: "2024-01-15T00:00:00Z",
    reviewedAt: "2024-01-30T00:00:00Z",
    approvedAt: "2024-02-05T00:00:00Z",
    startDate: "2024-02-15",
    
    // Current Status
    currentStage: "pre-incubation",
    status: "active",
    
    // Progress Tracking
    fundingReceived: 500000,
    employees: 3,
    achievements: [
      "Received pre-incubation funding of ₹5 Lakhs",
      "Established research partnerships with 2 hospitals",
      "Completed preliminary AI model development"
    ],
    milestones: [
      "Research Validation",
      "AI Model Development",
      "Clinical Partnerships",
      "Regulatory Pathway"
    ],
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z"
  },
  {
    id: "2",
    // A. Applicant Details
    applicantName: "Priya Singh",
    applicantBackground: "CV_Priya_Singh.pdf",
    companyName: "HealthTech Innovations",
    foundingTeam: [
      {
        name: "Priya Singh",
        address: "456 Innovation Hub, Bangalore, Karnataka - 560001",
        contact: "priya@healthtech.com, +91-8765432109"
      },
      {
        name: "Dr. Amit Kumar",
        address: "789 Medical Center, Delhi - 110001",
        contact: "amit@healthtech.com, +91-7654321098"
      }
    ],
    shareholdingStructure: [
      {
        name: "Priya Singh",
        shares: 70,
        percentage: 70,
        designation: "Founder & CEO"
      },
      {
        name: "Dr. Amit Kumar",
        shares: 30,
        percentage: 30,
        designation: "Co-founder & Medical Advisor"
      }
    ],
    partnershipDetails: "Technical partnership with medical expertise",
    hasFiledITReturn: false,
    registrationNo: "U72900KA2024PTC234567",
    registrationDate: "2024-02-01",
    registeringAuthority: "Registrar of Companies, Bangalore",
    pan: "BCDEF2345G",
    tan: "BPLM23456B",
    
    // B. Background
    problemAddressed: "Rural India faces severe healthcare access challenges with 70% of the population living in rural areas but only 30% of healthcare facilities. Telemedicine can bridge this gap but current solutions lack AI-powered diagnostic support and are not optimized for Indian rural conditions.",
    proposedSolution: "Our AI-powered telemedicine platform provides preliminary diagnosis support, symptom analysis, and connects rural patients with qualified doctors through video consultations. The platform includes AI chatbot for initial screening and automated appointment scheduling.",
    
    // C. Business Details
    productServiceDetails: "Mobile-first telemedicine platform with AI-powered diagnostic support, video consultation capabilities, prescription management, and integration with local pharmacies for medicine delivery.",
    targetCustomer: "Rural patients, primary healthcare centers, district hospitals, and telemedicine service providers in tier-2 and tier-3 cities.",
    businessPlan: "Phase 1: Launch in 3 states (6 months), Phase 2: Expand to 10 states (12 months), Phase 3: Pan-India coverage (18 months). Target 100,000 users in first year.",
    marketSize: "Indian telemedicine market is $5.4 billion and growing at 31% CAGR. Rural healthcare represents $2.1 billion opportunity with 900 million people in rural areas.",
    goToMarketStrategy: "Partnerships with state governments, tie-ups with rural healthcare centers, direct marketing to district hospitals, and collaboration with local NGOs.",
    revenueModel: "Freemium model: Basic consultation free, Premium features ₹99/month, B2B licensing to hospitals at ₹10,000/month per facility.",
    competitors: "Practo, 1mg, Apollo 24x7. Our advantage is AI-powered diagnosis and rural focus with offline capabilities.",
    fundingInvestment: "Raised ₹5 Lakhs from angel investors. Planning to raise ₹2 Crores in Series A within 12 months for expansion and technology development.",
    swotAnalysis: "Strengths: Rural focus, AI technology, local partnerships. Weaknesses: Limited funding, regulatory challenges. Opportunities: Government digital health initiatives, growing smartphone penetration. Threats: Competition from established players, internet connectivity issues.",
    otherDetails: "Platform designed for low-bandwidth environments with offline capabilities. Integration with Aadhaar for patient verification and government health schemes.",
    
    // D. Scientific/Technological Details
    technologyCategory: "self-developed",
    technologyDetails: "AI-powered symptom analysis using natural language processing, computer vision for medical image analysis, and machine learning for diagnostic recommendations. Built using React Native, Node.js, and TensorFlow.",
    canBePatented: true,
    conductedPatentSearch: false,
    appliedForPatent: false,
    patentDetails: "Planning to conduct patent search and file applications for AI diagnostic algorithms within 6 months.",
    otherIPRProtection: "Trademark for platform name, copyright for software, and trade secrets for AI algorithms.",
    
    // E. Incubation Requirement
    infrastructureFacilities: "Development workstations, testing devices, cloud infrastructure, and secure data storage for patient information.",
    mentors: "Finance (fundraising and financial planning), Marketing (rural market penetration), Engineering (scalable architecture)",
    manpower: "3 student interns for market research and user testing, 2 part-time developers for platform development",
    
    // Application Status
    applicationType: "pre-incubation",
    applicationStatus: "under-review",
    submittedAt: "2024-02-01T00:00:00Z",
    reviewedAt: "2024-02-15T00:00:00Z",
    
    // Current Status
    currentStage: "pre-incubation",
    status: "active",
    
    // Progress Tracking
    fundingReceived: 0,
    employees: 4,
    achievements: [
      "Completed MVP development",
      "Secured pilot partnerships with 2 rural clinics"
    ],
    milestones: [
      "MVP Development",
      "Pilot Testing",
      "Regulatory Approval",
      "Market Launch"
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z"
  },
  {
    id: "3",
    // A. Applicant Details
    applicantName: "Dr. Michael Chen",
    applicantBackground: "CV_Michael_Chen.pdf",
    companyName: "BioTech Solutions",
    foundingTeam: [
      {
        name: "Dr. Michael Chen",
        address: "789 Research Park, Hyderabad, Telangana - 500001",
        contact: "michael@biotech.com, +91-7654321098"
      },
      {
        name: "Dr. Lisa Wang",
        address: "321 Science Center, Mumbai, Maharashtra - 400001",
        contact: "lisa@biotech.com, +91-6543210987"
      }
    ],
    shareholdingStructure: [
      {
        name: "Dr. Michael Chen",
        shares: 60,
        percentage: 60,
        designation: "Founder & CEO"
      },
      {
        name: "Dr. Lisa Wang",
        shares: 40,
        percentage: 40,
        designation: "Co-founder & CSO"
      }
    ],
    partnershipDetails: "Research partnership with shared IP rights",
    hasFiledITReturn: false,
    registrationNo: "U72900TG2024PTC345678",
    registrationDate: "2024-03-01",
    registeringAuthority: "Registrar of Companies, Hyderabad",
    pan: "CDEFG3456H",
    tan: "BPLM34567C",
    
    // B. Background
    problemAddressed: "Genetic disorders affect 1 in 20 people globally, with limited treatment options available. Current gene therapy approaches are expensive and not accessible in developing countries like India. There's a critical need for affordable, effective gene therapy solutions.",
    proposedSolution: "Our CRISPR-based gene therapy platform uses novel gene editing techniques to treat inherited genetic disorders. The platform includes personalized treatment protocols, safety monitoring systems, and cost-effective delivery methods for Indian healthcare system.",
    
    // C. Business Details
    productServiceDetails: "CRISPR-Cas9 based gene editing therapy for treating inherited genetic disorders. Platform includes gene editing protocols, safety assessment tools, and personalized treatment planning for patients with genetic disorders.",
    targetCustomer: "Hospitals with genetic medicine departments, research institutions, genetic counseling centers, and patients with inherited genetic disorders.",
    businessPlan: "Phase 1: Develop and validate gene editing protocols (12 months), Phase 2: Pre-clinical studies and safety testing (18 months), Phase 3: Clinical trials and regulatory approval (24 months).",
    marketSize: "Global gene therapy market is $4.2 billion and growing at 25% CAGR. Indian market represents $200 million opportunity with 50 million people affected by genetic disorders.",
    goToMarketStrategy: "Partnerships with major hospitals, collaboration with research institutions, direct marketing to genetic medicine departments, and strategic alliances with genetic counseling centers.",
    revenueModel: "B2B partnerships with hospitals at ₹50,000 per treatment, licensing agreements with research institutions at ₹10 Lakhs per protocol, and consulting services at ₹1 Lakh per project.",
    competitors: "Editas Medicine, CRISPR Therapeutics, Intellia Therapeutics. Our advantage is cost-effective solutions and focus on Indian genetic disorders.",
    fundingInvestment: "Raised ₹10 Lakhs from government grants. Planning to raise ₹5 Crores in Series A within 18 months for clinical trials and regulatory approval.",
    swotAnalysis: "Strengths: Strong research background, novel technology, government support. Weaknesses: High regulatory requirements, long development timeline. Opportunities: Growing awareness of genetic disorders, government healthcare initiatives. Threats: Regulatory challenges, competition from established players.",
    otherDetails: "Platform designed for Indian genetic diversity with focus on common genetic disorders in Indian population. Integration with existing healthcare infrastructure and compliance with Indian regulatory requirements.",
    
    // D. Scientific/Technological Details
    technologyCategory: "self-developed",
    technologyDetails: "Novel CRISPR-Cas9 gene editing protocols, safety assessment algorithms, and personalized treatment planning systems. Technology stack includes Python, R, and specialized bioinformatics tools.",
    canBePatented: true,
    conductedPatentSearch: true,
    appliedForPatent: true,
    patentDetails: "Patent application filed for gene editing protocol (Application No: 202441012345, Publication date: 2024-06-15). Additional patents planned for safety protocols.",
    otherIPRProtection: "Trademark for company name, copyright for software algorithms, and trade secrets for proprietary gene editing techniques.",
    
    // E. Incubation Requirement
    infrastructureFacilities: "Molecular biology lab setup, CRISPR equipment, cell culture facilities, biosafety level 2 laboratory, and secure data storage for genetic information.",
    mentors: "Finance (fundraising and financial planning), Marketing (healthcare market penetration), Engineering (laboratory automation and data management)",
    manpower: "2 student interns for laboratory work and data collection, 1 part-time bioinformatician for data analysis",
    
    // Application Status
    applicationType: "pre-incubation",
    applicationStatus: "submitted",
    submittedAt: "2024-03-01T00:00:00Z",
    
    // Current Status
    currentStage: "pre-incubation",
    status: "active",
    
    // Progress Tracking
    fundingReceived: 0,
    employees: 4,
    achievements: [
      "Secured research grants",
      "Established lab partnerships"
    ],
    milestones: [
      "Research Validation",
      "Protocol Development",
      "Pre-clinical Studies",
      "Clinical Trials"
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z"
  }
];

const stageLabels: Record<PreIncubatedCompany["currentStage"], string> = {
  "pre-incubation": "Pre-Incubation",
  "incubation": "Incubation",
  "graduated": "Graduated",
  "exited": "Exited"
};

const statusLabels: Record<PreIncubatedCompany["status"], string> = {
  "active": "Active",
  "inactive": "Inactive",
  "graduated": "Graduated",
  "exited": "Exited"
};

const applicationStatusLabels: Record<PreIncubatedCompany["applicationStatus"], string> = {
  "submitted": "Submitted",
  "under-review": "Under Review",
  "approved": "Approved",
  "rejected": "Rejected",
  "incubated": "Incubated",
  "graduated": "Graduated",
  "exited": "Exited"
};

const stageColors: Record<PreIncubatedCompany["currentStage"], string> = {
  "pre-incubation": "bg-blue-100 text-blue-800",
  "incubation": "bg-green-100 text-green-800",
  "graduated": "bg-purple-100 text-purple-800",
  "exited": "bg-gray-100 text-gray-800"
};

const statusColors: Record<PreIncubatedCompany["status"], string> = {
  "active": "bg-green-100 text-green-800",
  "inactive": "bg-yellow-100 text-yellow-800",
  "graduated": "bg-purple-100 text-purple-800",
  "exited": "bg-gray-100 text-gray-800"
};

const applicationStatusColors: Record<PreIncubatedCompany["applicationStatus"], string> = {
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

export default function PreIncubationManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<PreIncubatedCompany["currentStage"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PreIncubatedCompany["status"] | "all">("all");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState<PreIncubatedCompany["applicationStatus"] | "all">("all");
  const [viewingCompany, setViewingCompany] = useState<PreIncubatedCompany | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    data: applicationsData,
    loading,
    error,
    fetchApplications,
    deleteApplication,
    fetchStats
  } = usePreIncubationApplications();

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
      active: companies.filter((c: PreIncubatedCompany) => c.status === "active").length,
      graduated: companies.filter((c: PreIncubatedCompany) => c.status === "graduated").length,
      exited: companies.filter((c: PreIncubatedCompany) => c.status === "exited").length,
      submitted: companies.filter((c: PreIncubatedCompany) => c.applicationStatus === "submitted").length,
      underReview: companies.filter((c: PreIncubatedCompany) => c.applicationStatus === "under-review").length,
      approved: companies.filter((c: PreIncubatedCompany) => c.applicationStatus === "approved").length,
      incubated: companies.filter((c: PreIncubatedCompany) => c.applicationStatus === "incubated").length,
      totalFunding: companies.reduce((sum: number, c: PreIncubatedCompany) => sum + (c.fundingReceived || 0), 0),
      totalEmployees: companies.reduce((sum: number, c: PreIncubatedCompany) => sum + (c.employees || 0), 0)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pre-Incubation Applications Management</h1>
          <p className="text-muted-foreground">
            Manage pre-incubation applications, track progress, and monitor early-stage company development.
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading applications</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardTitle className="text-sm font-medium">Currently Pre-Incubated</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.incubated}</div>
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
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <select 
                value={applicationStatusFilter} 
                onChange={(e) => setApplicationStatusFilter(e.target.value as PreIncubatedCompany["applicationStatus"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Application Status</option>
                {Object.entries(applicationStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={stageFilter} 
                onChange={(e) => setStageFilter(e.target.value as PreIncubatedCompany["currentStage"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Current Stages</option>
                {Object.entries(stageLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as PreIncubatedCompany["status"] | "all")}
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
          <CardTitle>Pre-Incubation Applications</CardTitle>
          <CardDescription>
            Manage and view all pre-incubation applications in a tabular format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Company/Product</th>
                  <th className="text-left p-3 font-medium">Applicant</th>
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
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  companies.map((company: PreIncubatedCompany) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-sm">{company.companyName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {company.productServiceDetails}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-sm">{company.applicantName}</div>
                        <div className="text-xs text-muted-foreground">{company.foundingTeam?.[0]?.contact || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={stageColors[company.currentStage as keyof typeof stageColors]}>
                        {stageLabels[company.currentStage as keyof typeof stageLabels]}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={applicationStatusColors[company.applicationStatus as keyof typeof applicationStatusColors]}>
                        {applicationStatusLabels[company.applicationStatus as keyof typeof applicationStatusLabels]}
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
              {searchTerm || stageFilter !== "all" || statusFilter !== "all" || applicationStatusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first pre-incubation application."}
            </p>
          </CardContent>
        </Card>
      )}


      {/* Company Detail View Modal */}
      {viewingCompany && (
        <PreIncubationForm
          application={viewingCompany}
          onClose={() => setViewingCompany(null)}
          isOpen={!!viewingCompany}
        />
      )}
    </div>
  );
}
