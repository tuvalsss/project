import React from 'react'
import { SocialMediaDashboard } from '../../components/Social/SocialMediaDashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/social')({
  component: SocialMediaDashboard,
})

export default function SocialPage() {
  return <SocialMediaDashboard />
} 