'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useMentors } from '@/hooks/useMentors';
import { 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MentorsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddMentorForm, setShowAddMentorForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState<any>(null);

  // Mentor management
  const {
    mentors,
    loading: mentorsLoading,
    error: mentorsError,
    pagination,
    fetchMentors,
    createMentor,
    updateMentor,
    deleteMentor,
    updateMentorStatus,
    refetch: refetchMentors,
  } = useMentors({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  // Form states
  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    company: '',
    expertise: [] as string[],
    bio: '',
    profileImage: '',
    linkedinProfile: '',
  });

  const [expertiseInput, setExpertiseInput] = useState('');

  // Fetch mentors on component mount and when search/page changes
  useEffect(() => {
    fetchMentors();
  }, [currentPage, searchTerm]);

  const handleAddMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mentorForm.name || !mentorForm.email || !mentorForm.phone || !mentorForm.designation || !mentorForm.company || !mentorForm.bio) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (mentorForm.expertise.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one expertise area',
        variant: 'destructive',
      });
      return;
    }

    const success = await createMentor(mentorForm);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Mentor created successfully',
      });
      setMentorForm({
        name: '',
        email: '',
        phone: '',
        designation: '',
        company: '',
        expertise: [],
        bio: '',
        profileImage: '',
        linkedinProfile: '',
      });
      setShowAddMentorForm(false);
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create mentor',
        variant: 'destructive',
      });
    }
  };

  const handleEditMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMentor) return;

    const success = await updateMentor(editingMentor.id, mentorForm);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Mentor updated successfully',
      });
      setEditingMentor(null);
      setMentorForm({
        name: '',
        email: '',
        phone: '',
        designation: '',
        company: '',
        expertise: [],
        bio: '',
        profileImage: '',
        linkedinProfile: '',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update mentor',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMentor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;

    const success = await deleteMentor(id);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Mentor deleted successfully',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete mentor',
        variant: 'destructive',
      });
    }
  };

  const handleToggleMentorStatus = async (id: string, currentStatus: boolean) => {
    const success = await updateMentorStatus(id, !currentStatus);
    
    if (success) {
      toast({
        title: 'Success',
        description: `Mentor ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update mentor status',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (mentor: any) => {
    setEditingMentor(mentor);
    setMentorForm({
      name: mentor.name,
      email: mentor.email,
      phone: mentor.phone,
      designation: mentor.designation,
      company: mentor.company,
      expertise: mentor.expertise,
      bio: mentor.bio,
      profileImage: mentor.profileImage || '',
      linkedinProfile: mentor.linkedinProfile || '',
    });
    setShowAddMentorForm(true);
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !mentorForm.expertise.includes(expertiseInput.trim())) {
      setMentorForm(prev => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()]
      }));
      setExpertiseInput('');
    }
  };

  const removeExpertise = (expertise: string) => {
    setMentorForm(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mentors</h1>
          <p className="text-muted-foreground">
            Manage mentor profiles and information
          </p>
        </div>
        <Button onClick={() => setShowAddMentorForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Mentor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Management</CardTitle>
          <CardDescription>
            View and manage all mentor profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {mentorsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : mentorsError ? (
              <div className="text-center py-8 text-destructive">
                {mentorsError}
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">{mentor.name}</h3>
                            <Badge variant={mentor.isActive ? 'default' : 'secondary'}>
                              {mentor.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {mentor.designation} at {mentor.company}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {mentor.email} • {mentor.phone}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {mentor.expertise.map((exp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {mentor.bio}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(mentor)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleMentorStatus(mentor.id, mentor.isActive)}
                            >
                              {mentor.isActive ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMentor(mentor.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </p>
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
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Mentor Modal */}
      {showAddMentorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
              </CardTitle>
              <CardDescription>
                {editingMentor ? 'Update mentor information' : 'Create a new mentor profile'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingMentor ? handleEditMentor : handleAddMentor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={mentorForm.name}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      value={mentorForm.email}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone *</label>
                    <Input
                      value={mentorForm.phone}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Designation *</label>
                    <Input
                      value={mentorForm.designation}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, designation: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Company *</label>
                  <Input
                    value={mentorForm.company}
                    onChange={(e) => setMentorForm(prev => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expertise Areas *</label>
                  <div className="flex gap-2">
                    <Input
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      placeholder="Add expertise area"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                    />
                    <Button type="button" onClick={addExpertise}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mentorForm.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {exp}
                        <button
                          type="button"
                          onClick={() => removeExpertise(exp)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio *</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={mentorForm.bio}
                    onChange={(e) => setMentorForm(prev => ({ ...prev, bio: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Profile Image URL</label>
                    <Input
                      value={mentorForm.profileImage}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, profileImage: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn Profile URL</label>
                    <Input
                      value={mentorForm.linkedinProfile}
                      onChange={(e) => setMentorForm(prev => ({ ...prev, linkedinProfile: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button type="submit">
                    {editingMentor ? 'Update Mentor' : 'Create Mentor'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddMentorForm(false);
                      setEditingMentor(null);
                      setMentorForm({
                        name: '',
                        email: '',
                        phone: '',
                        designation: '',
                        company: '',
                        expertise: [],
                        bio: '',
                        profileImage: '',
                        linkedinProfile: '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
