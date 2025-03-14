import React from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { UserRole } from './client'

export const App: React.FC = () => {
  return (
    <div>
      <nav>
        <Link to="/_layout/">Dashboard</Link>
        <Link to="/_layout/settings">Settings</Link>
        <Link to="/_layout/ai-analysis">AI Analysis</Link>
        <Link to="/_layout/affiliate">Affiliate</Link>
        <Link to="/_layout/affiliates">Affiliates</Link>
        <Link to="/_layout/campaigns">Campaigns</Link>
        <Link to="/_layout/items">Items</Link>
        <Link to="/_layout/reports">Reports</Link>
        <Link to="/_layout/social">Social</Link>
        <Link to="/_layout/admin">Admin</Link>
      </nav>
      <Outlet />
    </div>
  )
} 