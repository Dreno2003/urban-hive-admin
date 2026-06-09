import { Toaster } from "@/shared/components/ui/sonner"
import "./globals.css"
import { QueryProvider } from "@/shared/components/providers/query-provider"

export const metadata = {
  title: "Urban Hive Admin",
  description: "Workspace and Property Management Console",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
        <Toaster/>
      </body>
    </html>
  )
}
