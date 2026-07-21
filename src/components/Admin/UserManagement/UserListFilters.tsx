import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { RoleFilter, StatusFilter } from './types';

const selectClass =
  'px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15';

interface UserListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  roadmapFilter: string;
  onRoadmapFilterChange: (value: string) => void;
  batchFilter: string;
  onBatchFilterChange: (value: string) => void;
  roadmapOptions: { id: string; title: string }[];
  batchOptions: { id: string; name: string }[];
  onAddUser: () => void;
}

export const UserListFilters: React.FC<UserListFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  roadmapFilter,
  onRoadmapFilterChange,
  batchFilter,
  onBatchFilterChange,
  roadmapOptions,
  batchOptions,
  onAddUser,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-col lg:flex-row justify-between gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all"
        />
      </div>
      <Button size="sm" onClick={onAddUser} className="shrink-0 self-start">
        Add User
      </Button>
    </div>

    <div className="flex flex-wrap gap-2">
      <select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value as RoleFilter)}
        className={selectClass}
        aria-label="Filter by role"
      >
        <option value="all">All Roles</option>
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
        <option value="admin">Admin</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
        className={selectClass}
        aria-label="Filter by status"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select
        value={roadmapFilter}
        onChange={(e) => onRoadmapFilterChange(e.target.value)}
        className={selectClass}
        aria-label="Filter by roadmap"
      >
        <option value="all">All Roadmaps</option>
        {roadmapOptions.map((r) => (
          <option key={r.id} value={r.id}>{r.title}</option>
        ))}
      </select>
      <select
        value={batchFilter}
        onChange={(e) => onBatchFilterChange(e.target.value)}
        className={selectClass}
        aria-label="Filter by batch"
      >
        <option value="all">All Batches</option>
        {batchOptions.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </div>
  </div>
);
