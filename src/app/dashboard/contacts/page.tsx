"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useContactSubmissions } from "@/hooks/useApi";
import { 
  Search, 
  Eye, 
  Mail, 
  Phone,
  Calendar,
  User,
  Building,
  MessageSquare,
  Filter,
  Loader2,
  Trash2,
  Reply,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface ContactSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  subscribeNewsletter: boolean;
  status: 'new' | 'in-progress' | 'responded' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'email' | 'phone' | 'referral' | 'other';
  submittedAt: string;
  respondedAt?: string;
  response?: string;
  respondedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

const statusLabels: Record<ContactSubmission["status"], string> = {
  "new": "New",
  "in-progress": "In Progress",
  "responded": "Responded",
  "closed": "Closed"
};

const statusColors: Record<ContactSubmission["status"], string> = {
  "new": "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "responded": "bg-green-100 text-green-800",
  "closed": "bg-gray-100 text-gray-800"
};

const priorityLabels: Record<ContactSubmission["priority"], string> = {
  "low": "Low",
  "medium": "Medium",
  "high": "High",
  "urgent": "Urgent"
};

const priorityColors: Record<ContactSubmission["priority"], string> = {
  "low": "bg-gray-100 text-gray-800",
  "medium": "bg-blue-100 text-blue-800",
  "high": "bg-orange-100 text-orange-800",
  "urgent": "bg-red-100 text-red-800"
};

export default function ContactManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactSubmission["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<ContactSubmission["priority"] | "all">("all");
  const [viewingContact, setViewingContact] = useState<ContactSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Use the contact submissions hook
  const {
    data: contactsData,
    loading,
    error,
    fetchContacts,
    deleteContact,
    fetchStats
  } = useContactSubmissions();

  // Separate hook for stats
  const {
    data: statsData,
    loading: statsLoading,
    fetchStats: fetchStatsData
  } = useContactSubmissions();

  // Fetch contacts and stats on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    };
    
    fetchContacts(params);
    fetchStatsData();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);

  const handleDeleteContact = async (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact submission?")) {
      try {
        await deleteContact(contactId);
        // Refresh the contacts list
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          sortBy: 'submittedAt',
          sortOrder: 'desc'
        };
        fetchContacts(params);
        fetchStatsData();
      } catch (error) {
        alert('Failed to delete contact submission');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get contacts and pagination from API data
  const contacts: ContactSubmission[] = contactsData?.data?.contacts || [];
  const pagination = contactsData?.data?.pagination;
  const stats = statsData?.data || {
    total: 0,
    new: 0,
    inProgress: 0,
    responded: 0,
    closed: 0
  };

  // Debug logging
  console.log('Contacts Data:', contactsData);
  console.log('Stats Data:', statsData);
  console.log('Contacts:', contacts);
  console.log('Stats:', stats);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Form Management</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions and track communication with potential clients.
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading contacts</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Being processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
            <p className="text-xs text-muted-foreground">
              Response sent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
            <p className="text-xs text-muted-foreground">
              Resolved
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
                placeholder="Search contacts by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as ContactSubmission["status"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value as ContactSubmission["priority"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            Manage and view all contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Submitted</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading contacts...</span>
                      </div>
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm">{contact.firstName} {contact.lastName}</div>
                          <div className="text-xs text-muted-foreground">{contact.email}</div>
                          {contact.organization && (
                            <div className="text-xs text-muted-foreground">{contact.organization}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{contact.subject}</div>
                      </td>
                      <td className="p-3">
                        <Badge className={statusColors[contact.status]}>
                          {statusLabels[contact.status]}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={priorityColors[contact.priority]}>
                          {priorityLabels[contact.priority]}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatDate(contact.submittedAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingContact(contact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteContact(contact._id)}
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
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} contacts
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Detail View Modal */}
      {viewingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Contact Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setViewingContact(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        {viewingContact.firstName} {viewingContact.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingContact.email}</p>
                    </div>
                    {viewingContact.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingContact.phone}</p>
                      </div>
                    )}
                    {viewingContact.organization && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organization</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingContact.organization}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Details */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Message Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">{viewingContact.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[100px] whitespace-pre-wrap">
                        {viewingContact.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={viewingContact.subscribeNewsletter} 
                        readOnly 
                        className="w-4 h-4" 
                      />
                      <span className="text-sm">Subscribed to newsletter</span>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Status Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        <Badge className={statusColors[viewingContact.status]}>
                          {statusLabels[viewingContact.status]}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        <Badge className={priorityColors[viewingContact.priority]}>
                          {priorityLabels[viewingContact.priority]}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Submitted At</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        {formatDate(viewingContact.submittedAt)}
                      </p>
                    </div>
                    {viewingContact.respondedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Responded At</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                          {formatDate(viewingContact.respondedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response */}
                {viewingContact.response && (
                  <div>
                    <h3 className="text-lg font-bold text-blue-600 mb-4">Response</h3>
                    <p className="text-sm p-2 bg-gray-50 border rounded min-h-[100px] whitespace-pre-wrap">
                      {viewingContact.response}
                    </p>
                    {viewingContact.respondedBy && (
                      <p className="text-xs text-gray-500 mt-2">
                        Responded by: {viewingContact.respondedBy.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}