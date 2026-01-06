'use client';

import { useEffect } from 'react';
import { useTeacherStore } from '@/stores/teacher.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useIsSuperAdmin } from '@/stores/auth.store';

export default function TeacherListPage() {
  const { teachers, isLoading, fetchTeachers, filters, setSearch, setStatusFilter } = useTeacherStore();
  const isSuperAdmin = useIsSuperAdmin();

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty members and assignments</p>
        </div>
        {!isSuperAdmin && (
          <Link href="/dashboard/teachers/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Teacher
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {filters.status === 'ALL' ? 'All' : filters.status}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('ALL')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('INACTIVE')}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('ON_LEAVE')}>On Leave</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="h-12 px-4 font-medium align-middle">Teacher</th>
                  <th className="h-12 px-4 font-medium align-middle">Contact</th>
                  <th className="h-12 px-4 font-medium align-middle">Specialization</th>
                  <th className="h-12 px-4 font-medium align-middle">Status</th>
                  <th className="h-12 px-4 font-medium align-middle text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="h-24 text-center">Loading...</td>
                  </tr>
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-24 text-center text-muted-foreground">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {teacher.firstName[0]}{teacher.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold">{teacher.firstName} {teacher.lastName}</div>
                            <div className="text-xs text-muted-foreground">ID: {teacher.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-muted-foreground">{teacher.email}</div>
                        <div className="text-xs text-muted-foreground">{teacher.phone}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {teacher.specialization}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset 
                          ${teacher.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                            teacher.status === 'ON_LEAVE' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                              'bg-gray-50 text-gray-600 ring-gray-500/10'}`}>
                          {teacher.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Link href={`/dashboard/teachers/${teacher.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
