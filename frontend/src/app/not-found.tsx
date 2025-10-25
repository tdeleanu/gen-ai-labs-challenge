import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IoHome, IoArrowBack } from "react-icons/io5"

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold holographic-text mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4 glow-text">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="neon-button">
              <IoArrowBack className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
          <Link href="/">
            <Button className="neon-button">
              <IoHome className="mr-2 h-4 w-4" />
              Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}