import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Property Finder - Find Your Dream Home',
  description: 'Discover the perfect property with our advanced search and filtering system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
