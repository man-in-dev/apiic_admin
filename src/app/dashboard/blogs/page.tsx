"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Save, X } from "lucide-react";
import { useBlogs } from "@/hooks/useBlogs";

interface BlogFormState {
  title: string;
  content: string;
  coverImage?: string;
  tags?: string;
  status: 'draft' | 'published';
}

export default function BlogsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);

  const { blogs, loading, error, createBlog, updateBlog, deleteBlog } = useBlogs({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const openCreate = () => {
    setEditingId(null);
    setShowForm(true);
    setTimeout(() => {
      if (titleRef.current) titleRef.current.value = '';
      if (coverRef.current) coverRef.current.value = '';
      if (tagsRef.current) tagsRef.current.value = '';
      if (contentRef.current) contentRef.current.value = '';
      if (statusRef.current) statusRef.current.value = 'draft';
    });
  };

  const openEdit = (id: string) => {
    const b = blogs.find(x => x.id === id);
    if (!b) return;
    setEditingId(id);
    setShowForm(true);
    setTimeout(() => {
      if (titleRef.current) titleRef.current.value = b.title;
      if (coverRef.current) coverRef.current.value = b.coverImage || '';
      if (tagsRef.current) tagsRef.current.value = (b.tags || []).join(', ');
      if (contentRef.current) contentRef.current.value = b.content;
      if (statusRef.current) statusRef.current.value = b.status;
    });
  };

  const onSave = async () => {
    const title = titleRef.current?.value?.trim() || '';
    const coverImage = coverRef.current?.value?.trim() || '';
    const tags = (tagsRef.current?.value || '').split(',').map(t => t.trim()).filter(Boolean);
    const content = contentRef.current?.value?.trim() || '';
    const status = (statusRef.current?.value as 'draft'|'published') || 'draft';
    if (!title || !content) { alert('Title and content are required'); return; }
    if (editingId) {
      await updateBlog(editingId, { title, content, coverImage, tags, status });
      setEditingId(null);
    } else {
      await createBlog({ title, content, coverImage, tags, status, isActive: true });
      setShowForm(false);
    }
  };

  const onDelete = async (id: string) => {
    if (confirm('Delete this blog?')) await deleteBlog(id);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs Management</h1>
          <p className="text-muted-foreground">Create and manage simple blog posts.</p>
        </div>
        <Button onClick={openCreate} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          New Blog
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <Card key={b.id} className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{b.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : new Date(b.createdAt || '').toLocaleDateString()}</p>
              <p className="text-gray-700 text-sm line-clamp-3">{b.content}</p>
              <div className="flex gap-2 pt-3 border-t mt-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(b.id)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(b.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(showForm || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {editingId ? (<><Edit className="h-5 w-5" /> Edit Blog</>) : (<><Plus className="h-5 w-5" /> New Blog</>)}
                </CardTitle>
                <CardDescription>Write a simple blog post.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeForm}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input ref={titleRef} placeholder="Enter blog title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input ref={coverRef} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input ref={tagsRef} placeholder="innovation, healthcare" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select ref={statusRef} defaultValue="draft" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <textarea ref={contentRef} className="w-full min-h-[200px] px-3 py-2 border border-input bg-background rounded-md text-sm" placeholder="Write your blog content..." />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={closeForm}>Cancel</Button>
                <Button onClick={onSave} disabled={loading}><Save className="mr-2 h-4 w-4" /> {editingId ? 'Update Blog' : 'Create Blog'}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


