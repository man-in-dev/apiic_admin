"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Save, 
  Plus,
  Calendar,
  Mail,
  Phone,
  Building2,
  Users,
  Award,
  DollarSign,
  FileText,
  CheckCircle
} from "lucide-react";

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

export interface IncubationApplication {
  id?: string;
  
  // Applicant Details
  applicantName: string;
  applicantEmail: string;
  dateOfBirth: string;
  qualification: string;
  contactDetails: string;
  entityType: "startup" | "individual";
  companyRegistrationDetails: string;
  
  // Innovation Details
  innovationTitle: string;
  prototypeTime: string;
  category: "Process" | "Product" | "New Application" | "Other";
  innovationDescription: string;
  applications: string;
  novelty: string;
  businessModel: string;
  rndStatus: string;
  trlStatus: string;
  
  // Team & IP
  teamMembers: string;
  patents: string;
  awards: string;
  
  // Incubation Requirements
  requestedPeriod: string;
  spaceRequested: string;
  equipmentRequired: string;
  otherIncubator: string;
  
  // Compliance & Ethics
  clinicalSamples: string;
  biosafetyClearance: string;
  employeesOnsite: number;
  
  // Financials & Support
  fundRaised: string;
  annualTurnover: string;
  incubationHelp: string;
  documents: string;
  
  // Pre-incubation specific
  isStudent: boolean;
  ideationMentorship: boolean;
  labAccess: boolean;
  prototypeSupport: boolean;
  businessPlanning: boolean;
  ecosystemExposure: boolean;
  
  // Additional Information
  priorFunding: boolean;
  fundingDetails: string;
  collaborationRequired: boolean;
  collaborationDept: string;
  futureVision: string;
  
  // Application Status
  applicationType: "incubation" | "pre-incubation";
  applicationStatus: "submitted" | "under-review" | "approved" | "rejected" | "incubated" | "graduated" | "exited";
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  startDate?: string;
  endDate?: string;
  
  // Current Status
  currentStage: "pre-incubation" | "incubation" | "graduated" | "exited";
  status: "active" | "inactive" | "graduated" | "exited";
  
  // Progress Tracking
  fundingReceived?: number;
  employees?: number;
  achievements?: string[];
  milestones?: string[];
  
  createdAt: string;
  updatedAt: string;
}

interface IncubationFormProps {
  application?: IncubationApplication;
  onSave: (application: IncubationApplication) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const applicationTypeLabels: Record<IncubationApplication["applicationType"], string> = {
  "incubation": "Incubation",
  "pre-incubation": "Pre-Incubation"
};

const applicationStatusLabels: Record<IncubationApplication["applicationStatus"], string> = {
  "submitted": "Submitted",
  "under-review": "Under Review",
  "approved": "Approved",
  "rejected": "Rejected",
  "incubated": "Incubated",
  "graduated": "Graduated",
  "exited": "Exited"
};

const stageLabels: Record<IncubationApplication["currentStage"], string> = {
  "pre-incubation": "Pre-Incubation",
  "incubation": "Incubation",
  "graduated": "Graduated",
  "exited": "Exited"
};

const statusLabels: Record<IncubationApplication["status"], string> = {
  "active": "Active",
  "inactive": "Inactive",
  "graduated": "Graduated",
  "exited": "Exited"
};

export function IncubationForm({ application, onSave, onCancel, isOpen }: IncubationFormProps) {
  const [formData, setFormData] = useState<Partial<IncubationApplication>>({
    applicantName: application?.applicantName || "",
    applicantEmail: application?.applicantEmail || "",
    dateOfBirth: application?.dateOfBirth || "",
    qualification: application?.qualification || "",
    contactDetails: application?.contactDetails || "",
    entityType: application?.entityType || "startup",
    companyRegistrationDetails: application?.companyRegistrationDetails || "",
    
    innovationTitle: application?.innovationTitle || "",
    prototypeTime: application?.prototypeTime || "",
    category: application?.category || "",
    innovationDescription: application?.innovationDescription || "",
    applications: application?.applications || "",
    novelty: application?.novelty || "",
    businessModel: application?.businessModel || "",
    rndStatus: application?.rndStatus || "",
    trlStatus: application?.trlStatus || "",
    
    teamMembers: application?.teamMembers || "",
    patents: application?.patents || "",
    awards: application?.awards || "",
    
    requestedPeriod: application?.requestedPeriod || "",
    spaceRequested: application?.spaceRequested || "",
    equipmentRequired: application?.equipmentRequired || "",
    otherIncubator: application?.otherIncubator || "",
    
    clinicalSamples: application?.clinicalSamples || "",
    biosafetyClearance: application?.biosafetyClearance || "",
    employeesOnsite: application?.employeesOnsite || 0,
    
    fundRaised: application?.fundRaised || "",
    annualTurnover: application?.annualTurnover || "",
    incubationHelp: application?.incubationHelp || "",
    documents: application?.documents || "",
    
    isStudent: application?.isStudent || false,
    ideationMentorship: application?.ideationMentorship || false,
    labAccess: application?.labAccess || false,
    prototypeSupport: application?.prototypeSupport || false,
    businessPlanning: application?.businessPlanning || false,
    ecosystemExposure: application?.ecosystemExposure || false,
    
    priorFunding: application?.priorFunding || false,
    fundingDetails: application?.fundingDetails || "",
    collaborationRequired: application?.collaborationRequired || false,
    collaborationDept: application?.collaborationDept || "",
    futureVision: application?.futureVision || "",
    
    applicationType: application?.applicationType || "incubation",
    applicationStatus: application?.applicationStatus || "submitted",
    currentStage: application?.currentStage || "pre-incubation",
    status: application?.status || "active",
    submittedAt: application?.submittedAt || new Date().toISOString(),
    startDate: application?.startDate || "",
    endDate: application?.endDate || "",
    
    fundingReceived: application?.fundingReceived || 0,
    employees: application?.employees || 0,
    achievements: application?.achievements || [],
    milestones: application?.milestones || [],
    
    createdAt: application?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleInputChange = (field: keyof IncubationApplication, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.applicantName || !formData.applicantEmail || !formData.innovationTitle) {
      alert("Please fill in all required fields (Applicant Name, Email, Innovation Title)");
      return;
    }

    const applicationData: IncubationApplication = {
      id: application?.id || Date.now().toString(),
      applicantName: formData.applicantName,
      applicantEmail: formData.applicantEmail,
      dateOfBirth: formData.dateOfBirth,
      qualification: formData.qualification,
      contactDetails: formData.contactDetails,
      entityType: formData.entityType as "startup" | "individual",
      companyRegistrationDetails: formData.companyRegistrationDetails,
      
      innovationTitle: formData.innovationTitle,
      prototypeTime: formData.prototypeTime,
      category: formData.category,
      innovationDescription: formData.innovationDescription,
      applications: formData.applications,
      novelty: formData.novelty,
      businessModel: formData.businessModel,
      rndStatus: formData.rndStatus,
      trlStatus: formData.trlStatus,
      
      teamMembers: formData.teamMembers,
      patents: formData.patents,
      awards: formData.awards,
      
      requestedPeriod: formData.requestedPeriod,
      spaceRequested: formData.spaceRequested,
      equipmentRequired: formData.equipmentRequired,
      otherIncubator: formData.otherIncubator,
      
      clinicalSamples: formData.clinicalSamples,
      biosafetyClearance: formData.biosafetyClearance,
      employeesOnsite: formData.employeesOnsite,
      
      fundRaised: formData.fundRaised,
      annualTurnover: formData.annualTurnover,
      incubationHelp: formData.incubationHelp,
      documents: formData.documents,
      
      isStudent: formData.isStudent,
      ideationMentorship: formData.ideationMentorship,
      labAccess: formData.labAccess,
      prototypeSupport: formData.prototypeSupport,
      businessPlanning: formData.businessPlanning,
      ecosystemExposure: formData.ecosystemExposure,
      
      priorFunding: formData.priorFunding,
      fundingDetails: formData.fundingDetails,
      collaborationRequired: formData.collaborationRequired,
      collaborationDept: formData.collaborationDept,
      futureVision: formData.futureVision,
      
      applicationType: formData.applicationType as "incubation" | "pre-incubation",
      applicationStatus: formData.applicationStatus as IncubationApplication["applicationStatus"],
      currentStage: formData.currentStage as IncubationApplication["currentStage"],
      status: formData.status as IncubationApplication["status"],
      submittedAt: formData.submittedAt,
      startDate: formData.startDate,
      endDate: formData.endDate,
      
      fundingReceived: formData.fundingReceived,
      employees: formData.employees,
      achievements: formData.achievements,
      milestones: formData.milestones,
      
      createdAt: formData.createdAt,
      updatedAt: new Date().toISOString()
    };

    onSave(applicationData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {application ? (
                <>
                  <Building2 className="h-5 w-5" />
                  Edit Application
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Add New Application
                </>
              )}
            </CardTitle>
            <CardDescription>
              {application ? "Update application information" : "Add a new incubation application"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* 1. Applicant Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Applicant Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Applicant Name *</label>
                <Input
                  placeholder="Enter full name"
                  value={formData.applicantName}
                  onChange={(e) => handleInputChange("applicantName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Applicant Email *</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.applicantEmail}
                  onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Qualification *</label>
                <Input
                  placeholder="e.g. MBBS, PhD, B.Tech"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Startup / Individual</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.entityType}
                  onChange={(e) => handleInputChange("entityType", e.target.value)}
                >
                  <option value="startup">Startup</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Registration Details</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Registered Address, Date of Incorporation, DIPP details"
                value={formData.companyRegistrationDetails}
                onChange={(e) => handleInputChange("companyRegistrationDetails", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Details (Address, Phone, Email, Website) *</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Full postal address, phone, email, website"
                value={formData.contactDetails}
                onChange={(e) => handleInputChange("contactDetails", e.target.value)}
              />
            </div>
          </div>

          {/* 2. Innovation Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Innovation Details</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title of The Technology/Innovation *</label>
              <Input
                placeholder="Enter innovation title"
                value={formData.innovationTitle}
                onChange={(e) => handleInputChange("innovationTitle", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Required For Prototype Readiness</label>
                <Input
                  placeholder="e.g. 3 months"
                  value={formData.prototypeTime}
                  onChange={(e) => handleInputChange("prototypeTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Of Technology / Innovation</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="Process">Process</option>
                  <option value="Product">Product</option>
                  <option value="New Application">New Application</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Details Of Proposed Idea / Innovation *</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Your idea will be kept confidential"
                value={formData.innovationDescription}
                onChange={(e) => handleInputChange("innovationDescription", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Potential Areas of Applications</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Specify industry/market applications"
                value={formData.applications}
                onChange={(e) => handleInputChange("applications", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Novelty & Freedom to Operate</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="IPS, FTO, similar products/services/technology availability"
                value={formData.novelty}
                onChange={(e) => handleInputChange("novelty", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Projected Business Model</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Describe your business model"
                value={formData.businessModel}
                onChange={(e) => handleInputChange("businessModel", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current status of R&D and other technological inputs</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Describe current R&D status"
                value={formData.rndStatus}
                onChange={(e) => handleInputChange("rndStatus", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Development Status / TRL & Market Info</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Describe current development status and TRL"
                value={formData.trlStatus}
                onChange={(e) => handleInputChange("trlStatus", e.target.value)}
              />
            </div>
          </div>

          {/* 3. Team & IP Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Team & IP</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Members / Partners / Mentors</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Attach brief CVs separately in email or upload portal"
                value={formData.teamMembers}
                onChange={(e) => handleInputChange("teamMembers", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patents (if any)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  placeholder="List any patents"
                  value={formData.patents}
                  onChange={(e) => handleInputChange("patents", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Awards (if any)</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  placeholder="List any awards"
                  value={formData.awards}
                  onChange={(e) => handleInputChange("awards", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 4. Incubation Requirements Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Incubation Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested Incubation Period</label>
                <Input
                  placeholder="e.g. 12 months"
                  value={formData.requestedPeriod}
                  onChange={(e) => handleInputChange("requestedPeriod", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Space Requested</label>
                <Input
                  placeholder="e.g. 2 desks / 200 sq.ft."
                  value={formData.spaceRequested}
                  onChange={(e) => handleInputChange("spaceRequested", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Major Equipment Required</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="List major equipment requirements"
                value={formData.equipmentRequired}
                onChange={(e) => handleInputChange("equipmentRequired", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currently Incubated Elsewhere?</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="If yes, specify incubator name and status"
                value={formData.otherIncubator}
                onChange={(e) => handleInputChange("otherIncubator", e.target.value)}
              />
            </div>
          </div>

          {/* 5. Compliance & Ethics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Compliance & Ethics</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Use of clinical/animal/microbial samples?</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="If yes, specify the nature of samples"
                value={formData.clinicalSamples}
                onChange={(e) => handleInputChange("clinicalSamples", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Biosafety / Ethical clearance required?</label>
                <Input
                  placeholder="Yes/No and details"
                  value={formData.biosafetyClearance}
                  onChange={(e) => handleInputChange("biosafetyClearance", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. of employees working onsite at CMIE</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.employeesOnsite}
                  onChange={(e) => handleInputChange("employeesOnsite", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* 6. Financials & Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Financials & Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fund Raised Till Now</label>
                <Input
                  placeholder="Amount and source"
                  value={formData.fundRaised}
                  onChange={(e) => handleInputChange("fundRaised", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Turnover</label>
                <Input
                  placeholder="Latest annual turnover"
                  value={formData.annualTurnover}
                  onChange={(e) => handleInputChange("annualTurnover", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Incubation Help You Expect From CMIE</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="Describe the help you expect from CMIE"
                value={formData.incubationHelp}
                onChange={(e) => handleInputChange("incubationHelp", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">List of Documents attached</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                placeholder="List all attached documents"
                value={formData.documents}
                onChange={(e) => handleInputChange("documents", e.target.value)}
              />
            </div>
          </div>

          {/* 7. Pre-Incubation Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Pre-Incubation (Students / Early Ideas)</h3>
            <p className="text-sm text-muted-foreground">Tick if applicable</p>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isStudent}
                  onChange={(e) => handleInputChange("isStudent", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Student / Individual Innovator with concept stage idea</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.ideationMentorship}
                  onChange={(e) => handleInputChange("ideationMentorship", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Ideation Mentorship</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.labAccess}
                  onChange={(e) => handleInputChange("labAccess", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Access to Lab Space & Instruments</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.prototypeSupport}
                  onChange={(e) => handleInputChange("prototypeSupport", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Prototype Development Support</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.businessPlanning}
                  onChange={(e) => handleInputChange("businessPlanning", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Mentoring & Business Planning</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.ecosystemExposure}
                  onChange={(e) => handleInputChange("ecosystemExposure", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Exposure to Startup Ecosystem</span>
              </label>
            </div>
          </div>

          {/* 8. Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prior funding / grants?</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="priorFunding"
                      checked={formData.priorFunding === true}
                      onChange={() => handleInputChange("priorFunding", true)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="priorFunding"
                      checked={formData.priorFunding === false}
                      onChange={() => handleInputChange("priorFunding", false)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
                {formData.priorFunding && (
                  <Input
                    placeholder="Grant name, amount, year"
                    value={formData.fundingDetails}
                    onChange={(e) => handleInputChange("fundingDetails", e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Require collaboration with AIIMS Patna departments?</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="collaborationRequired"
                      checked={formData.collaborationRequired === true}
                      onChange={() => handleInputChange("collaborationRequired", true)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="collaborationRequired"
                      checked={formData.collaborationRequired === false}
                      onChange={() => handleInputChange("collaborationRequired", false)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
                {formData.collaborationRequired && (
                  <Input
                    placeholder="e.g., Microbiology, Biochemistry, Clinical Trials"
                    value={formData.collaborationDept}
                    onChange={(e) => handleInputChange("collaborationDept", e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Future Plans & Vision (100 words)</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  placeholder="Describe your future plans and vision"
                  value={formData.futureVision}
                  onChange={(e) => handleInputChange("futureVision", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Application Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Application Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Type *</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.applicationType}
                  onChange={(e) => handleInputChange("applicationType", e.target.value)}
                >
                  {Object.entries(applicationTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Status *</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.applicationStatus}
                  onChange={(e) => handleInputChange("applicationStatus", e.target.value)}
                >
                  {Object.entries(applicationStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Stage *</label>
                <select 
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.currentStage}
                  onChange={(e) => handleInputChange("currentStage", e.target.value)}
                >
                  {Object.entries(stageLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Submitted Date *</label>
                <Input
                  type="date"
                  value={formData.submittedAt ? formData.submittedAt.split('T')[0] : ""}
                  onChange={(e) => handleInputChange("submittedAt", e.target.value + "T00:00:00Z")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {application ? "Update Application" : "Create Application"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
