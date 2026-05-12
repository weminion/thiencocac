import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/features/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/');

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    'Khách';

  return (
    <DashboardShell userName={displayName} userId={user.id}>
      {children}
    </DashboardShell>
  );
}
