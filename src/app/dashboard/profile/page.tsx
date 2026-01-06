'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Mail, Phone, MapPin, Briefcase, Shield, Building2, User, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminProfilePage() {
    const { user, setUser } = useAuthStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    if (!user) return null;

    const isSuperAdmin = user.role === 'SUPER_ADMIN';

    const handleEditClick = () => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update user in store
            setUser({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
            });

            toast.success('Profile updated successfully!');
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and preferences</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Profile Card */}
                    <div className="md:col-span-2">
                        <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                                {user.firstName[0]}{user.lastName[0]}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                                <p className="text-muted-foreground capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            {user.phone}
                                        </div>
                                    )}
                                    {user.tenant && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="w-4 h-4" />
                                            {user.tenant.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleEditClick}
                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Details */}
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Administrative Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">User ID</span>
                                <span className="font-medium">{user.id}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Role</span>
                                <span className="font-medium capitalize">{user.role.replace('_', ' ')}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Email Verified</span>
                                <span className="font-medium">
                                    {user.isEmailVerified ? (
                                        <span className="text-green-600">✓ Verified</span>
                                    ) : (
                                        <span className="text-amber-600">Pending</span>
                                    )}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Account Created</span>
                                <span className="font-medium">{format(new Date(), 'MMMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    {/* System Access */}
                    <div className="bg-card rounded-xl border shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">System Access</h3>
                        </div>
                        <div className="space-y-4">
                            {isSuperAdmin ? (
                                <>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Access Level</span>
                                        <span className="font-medium">Full System Access</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Permissions</span>
                                        <span className="font-medium">All Permissions</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Tenant Access</span>
                                        <span className="font-medium">All Tenants</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Access Level</span>
                                        <span className="font-medium">School Administrator</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">School</span>
                                        <span className="font-medium">{user.tenant?.name || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">School Code</span>
                                        <span className="font-medium">{user.tenant?.code || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-muted-foreground">Active Permissions</span>
                                        <span className="font-medium">{user.permissions.length} permissions</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Permissions List (for non-super admins) */}
                    {!isSuperAdmin && user.permissions.length > 0 && (
                        <div className="md:col-span-2 bg-card rounded-xl border shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold">Your Permissions</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {user.permissions.map((permission) => (
                                    <div
                                        key={permission}
                                        className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                                    >
                                        {permission.replace(/_/g, ' ').toLowerCase()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => !isLoading && setIsEditModalOpen(false)}
                    />
                    
                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-card rounded-xl border shadow-lg w-full max-w-md">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-xl font-bold">Edit Profile</h2>
                                <button
                                    onClick={() => !isLoading && setIsEditModalOpen(false)}
                                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                                    disabled={isLoading}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 1234567890"
                                        className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
