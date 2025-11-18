import StudentLayout from "../student-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StudentLayout>{children}</StudentLayout>
}