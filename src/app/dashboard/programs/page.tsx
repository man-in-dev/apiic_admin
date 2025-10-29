"use client";

import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  Save,
  X
} from "lucide-react";

// Interface based on the exact frontend rendering
export interface Program {
  id: string;
  title: string;
  duration: string; // e.g., "3-6 months"
  bullets: string[];
}

import { usePrograms } from "@/hooks/usePrograms";

export default function ProgramsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const bulletsRef = useRef<HTMLTextAreaElement>(null);

  const { programs, loading, error, createProgram, updateProgram, deleteProgram } = usePrograms({ limit: 100 });

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    const title = titleRef.current?.value?.trim() || '';
    const duration = durationRef.current?.value?.trim() || '';
    const bullets = (bulletsRef.current?.value || '').split('\n').map(b => b.trim()).filter(Boolean);
    if (!title || bullets.length === 0) { alert('Title and at least one bullet are required'); return; }
    if (editingProgram) {
      await updateProgram(editingProgram.id, { title, duration, bullets });
      setEditingProgram(null);
    } else {
      await createProgram({ title, duration, bullets });
      setShowAddForm(false);
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
  };

  const handleDeleteProgram = async (programId: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      await deleteProgram(programId);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProgram(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Programs Management</h1>
          <p className="text-muted-foreground">
            Manage the programs that appear on the Available Programs page.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Programs List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-3">
                {program.title}
                {program.duration && (
                  <span className="text-gray-600 font-normal"> ({program.duration})</span>
                )}
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm mb-4">
                {program.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditProgram(program)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProgram(program.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No programs found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first program."}
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Program Form Modal */}
      {showAddForm || editingProgram ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {editingProgram ? (
                    <>
                      <Edit className="h-5 w-5" />
                      Edit Program
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add New Program
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Manage program details, duration, and bullet points
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCancelForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Program Title *</label>
                <Input ref={titleRef}
                  placeholder="Enter program title"
                  defaultValue={editingProgram?.title || ""}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input ref={durationRef}
                  placeholder="e.g., 3-6 months"
                  defaultValue={editingProgram?.duration || ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bullet Points (one per line) *</label>
                <textarea ref={bulletsRef}
                  className="w-full min-h-[120px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  placeholder="Enter program features, one per line"
                  defaultValue={editingProgram?.bullets?.join('\n') || ""}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingProgram ? "Update Program" : "Create Program"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
