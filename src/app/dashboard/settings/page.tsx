'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useChangePassword } from '@/hooks/useAdmins';
import { 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password change
  const {
    loading: passwordLoading,
    error: passwordError,
    changePassword,
  } = useChangePassword();

  // Form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'New password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (!passwordForm.currentPassword) {
      toast({
        title: 'Error',
        description: 'Current password is required',
        variant: 'destructive',
      });
      return;
    }

    const success = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to change password',
        variant: 'destructive',
      });
    }
  };


  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Password Settings</h1>
          <p className="text-muted-foreground">
            Change your password or another admin's password
          </p>
        </div>
      </div>

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password or change another admin's password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
