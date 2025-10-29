"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAnnouncements } from "@/hooks/useApi";
import AnnouncementForm, { AnnouncementFormData } from "@/components/dashboard/announcement-form";
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  User,
  Link,
  MessageSquare,
  Filter,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive
} from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  link: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

const statusLabels: Record<Announcement["status"], string> = {
  "draft": "Draft",
  "published": "Published",
  "archived": "Archived"
};

const statusColors: Record<Announcement["status"], string> = {
  "draft": "bg-gray-100 text-gray-800",
  "published": "bg-green-100 text-green-800",
  "archived": "bg-red-100 text-red-800"
};

const priorityLabels: Record<Announcement["priority"], string> = {
  "low": "Low",
  "medium": "Medium",
  "high": "High",
  "urgent": "Urgent"
};

const priorityColors: Record<Announcement["priority"], string> = {
  "low": "bg-gray-100 text-gray-800",
  "medium": "bg-blue-100 text-blue-800",
  "high": "bg-orange-100 text-orange-800",
  "urgent": "bg-red-100 text-red-800"
};

export default function AnnouncementManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Announcement["status"] | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Announcement["priority"] | "all">("all");
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Use the announcements hook
  const {
    data: announcementsData,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    fetchStats
  } = useAnnouncements();

  // Separate hook for stats
  const {
    data: statsData,
    loading: statsLoading,
    fetchStats: fetchStatsData
  } = useAnnouncements();

  // Fetch announcements and stats on component mount and when filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      priority: priorityFilter !== "all" ? priorityFilter : undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    fetchAnnouncements(params);
    fetchStatsData();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement(announcementId);
        // Refresh the announcements list
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };
        fetchAnnouncements(params);
        fetchStatsData();
      } catch (error) {
        alert('Failed to delete announcement');
      }
    }
  };

  const handleCreateAnnouncement = async (data: AnnouncementFormData) => {
    console.log('handleCreateAnnouncement called with data:', data);
    try {
      console.log('Calling createAnnouncement API...');
      await createAnnouncement(data);
      console.log('Announcement created successfully');
      setShowCreateForm(false);
      // Refresh the announcements list
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      fetchAnnouncements(params);
      fetchStatsData();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement');
    }
  };

  const handleUpdateAnnouncement = async (data: AnnouncementFormData) => {
    if (!editingAnnouncement) return;
    
    try {
      await updateAnnouncement(editingAnnouncement._id, data);
      setEditingAnnouncement(null);
      // Refresh the announcements list
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      fetchAnnouncements(params);
      fetchStatsData();
    } catch (error) {
      alert('Failed to update announcement');
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

  // Get announcements and pagination from API data
  const announcements: Announcement[] = announcementsData?.data?.announcements || [];
  const pagination = announcementsData?.data?.pagination;
  const stats = statsData?.data || {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    active: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcement Management</h1>
          <p className="text-muted-foreground">
            Create and manage announcements for the platform.
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">
              <p className="font-medium">Error loading announcements</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All announcements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-muted-foreground">
              Live announcements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Archive className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            <p className="text-xs text-muted-foreground">
              Archived announcements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
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
                placeholder="Search announcements by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value as Announcement["status"] | "all")}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value as Announcement["priority"] | "all")}
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

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>
            Manage and view all announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Created</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading announcements...</span>
                      </div>
                    </td>
                  </tr>
                ) : announcements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No announcements found
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm">{announcement.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {announcement.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={statusColors[announcement.status]}>
                          {statusLabels[announcement.status]}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={priorityColors[announcement.priority]}>
                          {priorityLabels[announcement.priority]}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {formatDate(announcement.createdAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingAnnouncement(announcement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => setEditingAnnouncement(announcement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} announcements
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

      {/* Announcement Detail View Modal */}
      {viewingAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Announcement Details</h2>
                <Button
                  variant="outline"
                  onClick={() => setViewingAnnouncement(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        {viewingAnnouncement.title}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Link</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        <a 
                          href={viewingAnnouncement.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {viewingAnnouncement.link}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm mt-1 p-2 bg-gray-50 border rounded min-h-[100px] whitespace-pre-wrap">
                      {viewingAnnouncement.description}
                    </p>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Status Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        <Badge className={statusColors[viewingAnnouncement.status]}>
                          {statusLabels[viewingAnnouncement.status]}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        <Badge className={priorityColors[viewingAnnouncement.priority]}>
                          {priorityLabels[viewingAnnouncement.priority]}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created At</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        {formatDate(viewingAnnouncement.createdAt)}
                      </p>
                    </div>
                    {viewingAnnouncement.publishedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Published At</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                          {formatDate(viewingAnnouncement.publishedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Information */}
                <div>
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Author Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created By</label>
                      <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                        {viewingAnnouncement.createdBy.name} ({viewingAnnouncement.createdBy.email})
                      </p>
                    </div>
                    {viewingAnnouncement.updatedBy && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Updated By</label>
                        <p className="text-sm mt-1 p-2 bg-gray-50 border rounded">
                          {viewingAnnouncement.updatedBy.name} ({viewingAnnouncement.updatedBy.email})
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Form */}
      {showCreateForm && (
        <AnnouncementForm
          onSubmit={handleCreateAnnouncement}
          onCancel={() => setShowCreateForm(false)}
          loading={loading}
          mode="create"
        />
      )}

      {/* Edit Announcement Form */}
      {editingAnnouncement && (
        <AnnouncementForm
          initialData={editingAnnouncement}
          onSubmit={handleUpdateAnnouncement}
          onCancel={() => setEditingAnnouncement(null)}
          loading={loading}
          mode="edit"
        />
      )}
    </div>
  );
}
