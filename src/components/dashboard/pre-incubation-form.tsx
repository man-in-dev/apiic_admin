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

export interface TeamMember {
  name: string;
  address: string;
  contact: string;
}

export interface Shareholder {
  name: string;
  shares: number;
  percentage: number;
  designation: string;
}

export interface PreIncubationApplication {
  id?: string;
  
  // A. Applicant Details
  applicantName: string;
  applicantBackground: string; // CV file path
  companyName: string;
  foundingTeam: TeamMember[];
  shareholdingStructure: Shareholder[];
  partnershipDetails: string;
  hasFiledITReturn: boolean;
  registrationNo: string;
  registrationDate: string;
  registeringAuthority: string;
  pan: string;
  tan: string;
  
  // B. Background
  problemAddressed: string;
  proposedSolution: string;
  
  // C. Business Details
  productServiceDetails: string;
  targetCustomer: string;
  businessPlan: string;
  marketSize: string;
  goToMarketStrategy: string;
  revenueModel: string;
  competitors: string;
  fundingInvestment: string;
  swotAnalysis: string;
  otherDetails: string;
  
  // D. Scientific/Technological Details
  technologyCategory: "to-be-developed" | "self-developed" | "acquired" | "licensed" | "off-the-shelf";
  technologyDetails: string;
  canBePatented: boolean;
  conductedPatentSearch: boolean;
  appliedForPatent: boolean;
  patentDetails: string;
  otherIPRProtection: string;
  
  // E. Incubation Requirement
  infrastructureFacilities: string;
  mentors: string;
  manpower: string;
  
  // Application Status
  applicationType: "pre-incubation";
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

interface PreIncubationFormProps {
  application?: PreIncubationApplication;
  onSave?: (application: PreIncubationApplication) => void;
  onClose: () => void;
  isOpen: boolean;
  mode?: 'view' | 'edit' | 'create';
}

const applicationStatusLabels: Record<PreIncubationApplication["applicationStatus"], string> = {
  "submitted": "Submitted",
  "under-review": "Under Review",
  "approved": "Approved",
  "rejected": "Rejected",
  "incubated": "Incubated",
  "graduated": "Graduated",
  "exited": "Exited"
};

const stageLabels: Record<PreIncubationApplication["currentStage"], string> = {
  "pre-incubation": "Pre-Incubation",
  "incubation": "Incubation",
  "graduated": "Graduated",
  "exited": "Exited"
};

const statusLabels: Record<PreIncubationApplication["status"], string> = {
  "active": "Active",
  "inactive": "Inactive",
  "graduated": "Graduated",
  "exited": "Exited"
};

export function PreIncubationForm({ application, onSave, onClose, isOpen, mode = 'view' }: PreIncubationFormProps) {
  if (!isOpen) return null;
  
  if (!application) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <p>No application data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Pre-Incubation Application Details
            </CardTitle>
            <CardDescription>
              View pre-incubation application information
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* A. Applicant Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">A. Applicant Details</h3>
            
            {/* 1. Name of Applicant */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Name of Applicant</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.applicantName}</p>
            </div>

            {/* 2. Background of Applicant */}
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Background of Applicant (Attach CV in .pdf format)</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.applicantBackground}</p>
            </div>

            {/* 3. Name of Proposed/Existing Company */}
            <div className="space-y-2">
              <label className="text-sm font-medium">3. Name of Proposed/Existing Company</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.companyName}</p>
            </div>

            {/* 4. Founding Team */}
            <div className="space-y-4">
              <label className="text-sm font-medium">4. Name, Address and Contact Details of Founding Team</label>
              {application.foundingTeam?.map((member, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium">Name</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{member.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Address</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{member.address}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Contact (Email & Phone)</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{member.contact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Shareholding Structure */}
            <div className="space-y-4">
              <label className="text-sm font-medium">5. Shareholding Structure</label>
              {application.shareholdingStructure?.map((shareholder, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Shareholder {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium">Name of Shareholder</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{shareholder.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">No. of Shares</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{shareholder.shares}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Percentage (%)</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{shareholder.percentage}%</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Designation/Role</label>
                      <p className="text-sm p-2 bg-gray-50 border rounded">{shareholder.designation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 6. Partnership Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">6. Partnership Details</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[80px]">{application.partnershipDetails}</p>
            </div>

            {/* 7. Has the company filed annual IT Return? */}
            <div className="space-y-2">
              <label className="text-sm font-medium">7. Has the company filed annual IT Return?</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.hasFiledITReturn ? "Yes" : "No"}</p>
            </div>

            {/* 8. Registration Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">8a. Registration No. and Date</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.registrationNo}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">8b. Registering Authority</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.registeringAuthority}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">8c. PAN</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.pan}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">8d. TAN</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.tan}</p>
              </div>
            </div>
          </div>

          {/* B. Background Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">B. Background (250-300 words each)</h3>
            
            {/* 1. Problem Addressed */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Problem Addressed</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[120px]">{application.problemAddressed}</p>
            </div>

            {/* 2. Proposed Solution */}
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Proposed Solution</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[120px]">{application.proposedSolution}</p>
            </div>
          </div>

          {/* C. Business Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">C. Business Details (350-500 words each)</h3>
            
            {/* 1. Product/Service Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Product/Service Details</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.productServiceDetails}</p>
            </div>

            {/* 2. Target Customer */}
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Target Customer</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.targetCustomer}</p>
            </div>

            {/* 3. Business Plan */}
            <div className="space-y-2">
              <label className="text-sm font-medium">3. Business Plan</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.businessPlan}</p>
            </div>

            {/* 4. Market Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">4. Market Size</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.marketSize}</p>
            </div>

            {/* 5. Go to Market Strategy */}
            <div className="space-y-2">
              <label className="text-sm font-medium">5. Go to Market Strategy</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.goToMarketStrategy}</p>
            </div>

            {/* 6. Revenue Model and Pricing */}
            <div className="space-y-2">
              <label className="text-sm font-medium">6. Revenue Model and Pricing</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.revenueModel}</p>
            </div>

            {/* 7. Competitors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">7. Competitors</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.competitors}</p>
            </div>

            {/* 8. Funding and Investment Received/Planned */}
            <div className="space-y-2">
              <label className="text-sm font-medium">8. Funding and Investment Received/Planned</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.fundingInvestment}</p>
            </div>

            {/* 9. SWOT Analysis */}
            <div className="space-y-2">
              <label className="text-sm font-medium">9. SWOT Analysis</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.swotAnalysis}</p>
            </div>

            {/* 10. Any Other Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">10. Any Other Details</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[150px]">{application.otherDetails}</p>
            </div>
          </div>

          {/* D. Scientific/Technological Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">D. Scientific/Technological Details</h3>
            
            {/* 1. Select the category of technological advancements */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Select the category of technological advancements</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.technologyCategory}</p>
            </div>

            {/* Give Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Give Details</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[100px]">{application.technologyDetails}</p>
            </div>

            {/* 2. If the technology is innovative and self-developed */}
            <div className="space-y-4">
              <h4 className="text-md font-medium">2. If the technology is innovative and self-developed</h4>
              
              {/* a) Can it be patented? */}
              <div className="space-y-2">
                <label className="text-sm font-medium">a) Can it be patented?</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.canBePatented ? "Yes" : "No"}</p>
              </div>

              {/* b) Have you conducted patent search? */}
              <div className="space-y-2">
                <label className="text-sm font-medium">b) Have you conducted patent search?</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.conductedPatentSearch ? "Yes" : "No"}</p>
              </div>

              {/* c) Have you applied for Patent? */}
              <div className="space-y-2">
                <label className="text-sm font-medium">c) Have you applied for Patent?</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.appliedForPatent ? "Yes" : "No"}</p>
              </div>

              {/* Furnish Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Furnish Details (Application No., Publication date etc.)</label>
                <p className="text-sm p-2 bg-gray-50 border rounded min-h-[80px]">{application.patentDetails}</p>
              </div>

              {/* d) Any Other IPR Protection required */}
              <div className="space-y-2">
                <label className="text-sm font-medium">d) Any Other IPR Protection required</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.otherIPRProtection}</p>
              </div>
            </div>
          </div>

          {/* E. Incubation Requirement Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">E. Incubation Requirement (Tentative)</h3>
            
            {/* 1. Infrastructure & Facilities */}
            <div className="space-y-2">
              <label className="text-sm font-medium">1. Infrastructure & Facilities</label>
              <p className="text-sm p-2 bg-gray-50 border rounded min-h-[100px]">{application.infrastructureFacilities}</p>
            </div>

            {/* 2. Mentors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Mentors (Domain of Specialization)</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.mentors}</p>
            </div>

            {/* 3. Manpower */}
            <div className="space-y-2">
              <label className="text-sm font-medium">3. Manpower</label>
              <p className="text-sm p-2 bg-gray-50 border rounded">{application.manpower}</p>
            </div>
          </div>

          {/* Application Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Application Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Status</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{applicationStatusLabels[application.applicationStatus]}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Stage</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{stageLabels[application.currentStage]}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{statusLabels[application.status]}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Submitted Date</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <p className="text-sm p-2 bg-gray-50 border rounded">{application.startDate || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
