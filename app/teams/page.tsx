// pages/teams.tsx
//
// Route for managing teams. This page imports the TeamManagerPage
// component and renders it directly. If your application uses the
// Next.js `pages` directory, this file will handle requests to
// `/teams`. If you instead use the `app` directory, you would
// create `app/teams/page.tsx` with the same content.

import TeamManagerPage from "@/components/pages/team-manager-page";

export default function Teams() {
  return <TeamManagerPage />;
}