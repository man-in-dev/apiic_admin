"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Save, 
  Eye, 
  Calendar,
  Link,
  MessageSquare,
  AlertCircle
} from "lucide-react";

export interface AnnouncementFormData {
  title: string;
  description: string;
  link: string;
  status: 'draft' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  publishedAt?: string;
  expiresAt?: string;
}

interface AnnouncementFormProps {
  initialData?: Partial<AnnouncementFormData>;
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-800' }
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export default function AnnouncementForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false,
  mode 
}: AnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    link: initialData?.link || '',
    status: initialData?.status || 'draft',
    priority: initialData?.priority || 'medium',
    isActive: initialData?.isActive ?? true,
    publishedAt: initialData?.publishedAt || '',
    expiresAt: initialData?.expiresAt || ''
  });

  const [errors, setErrors] = useState<Partial<AnnouncementFormData>>({});

  const validateForm = (): boolean => {
    console.log('Validating form with data:', formData);
    const newErrors: Partial<AnnouncementFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
    } else {
      try {
        new URL(formData.link);
      } catch {
        newErrors.link = 'Please provide a valid URL';
      }
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    if (validateForm()) {
      console.log('Form validation passed, calling onSubmit');
      onSubmit(formData);
    } else {
      console.log('Form validation failed');
    }
  };

  const handleInputChange = (field: keyof AnnouncementFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'create' ? 'Create New Announcement' : 'Edit Announcement'}
            </h2>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Enter the announcement details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter announcement title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter announcement description"
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Link <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://example.com"
                    className={errors.link ? 'border-red-500' : ''}
                  />
                  {errors.link && (
                    <p className="text-sm text-red-500 mt-1">{errors.link}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status and Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Status & Priority
                </CardTitle>
                <CardDescription>
                  Set the announcement status and priority level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as AnnouncementFormData['status'])}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value as AnnouncementFormData['priority'])}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
                    >
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active announcement
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule (Optional)
                </CardTitle>
                <CardDescription>
                  Set publication and expiration dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Published At</label>
                    <Input
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to publish immediately
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Expires At</label>
                    <Input
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for no expiration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview
                </CardTitle>
                <CardDescription>
                  How the announcement will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{formData.title || 'Announcement Title'}</h3>
                    <div className="flex gap-2">
                      <Badge className={statusOptions.find(s => s.value === formData.status)?.color}>
                        {statusOptions.find(s => s.value === formData.status)?.label}
                      </Badge>
                      <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                        {priorityOptions.find(p => p.value === formData.priority)?.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {formData.description || 'Announcement description will appear here...'}
                  </p>
                  {formData.link && (
                    <a 
                      href={formData.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Link className="h-4 w-4 mr-1" />
                      {formData.link}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
                onClick={() => console.log('Submit button clicked')}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Create' : 'Update'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
