// src/pages/Dashboard.tsx
import { TypographyH1, TypographySmall } from "../components/Typography"

function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-16">
      <TypographyH1 className="">Dashboard</TypographyH1>
      <TypographySmall className="">
        Manage your students efficiently with our comprehensive system
      </TypographySmall>
    </div>
  )
}

export default Dashboard
