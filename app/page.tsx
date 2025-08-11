import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon, LightbulbIcon, ShieldCheckIcon } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-foreground01 text-background flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center">
        <div className="container px-4 md:px-6 z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6">
            Welcome to Your New Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover powerful features designed to streamline your workflow and enhance your productivity.
          </p>
          <Link href="/login" passHref>
            <Button size="lg" className="bg-[var(--chart-6)] text-black hover:bg-[var(--chart-7)]">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 bg-foreground01">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-background border-border shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <RocketIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl font-semibold">Blazing Fast</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Experience unparalleled speed and performance with our optimized infrastructure.
              </CardContent>
            </Card>
            <Card className="bg-background border-border shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <LightbulbIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl font-semibold">Intuitive Design</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                A user-friendly interface that makes complex tasks simple and enjoyable.
              </CardContent>
            </Card>
            <Card className="bg-background border-border shadow-lg">
              <CardHeader className="flex flex-col items-center text-center">
                <ShieldCheckIcon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl font-semibold">Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Your data is protected with industry-leading security measures and constant reliability.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Join thousands of satisfied users and transform your digital experience today.
          </p>
          <Link href="/login" passHref>
            <Button
              size="lg"
              variant="secondary" className="bg-[var(--chart-6)] text-black hover:bg-[var(--chart-7)]">
              Sign Up Now
            </Button>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-foreground01 text-muted-foreground text-center">
        <div className="container px-4 md:px-6">
          <p>&copy; {new Date().getFullYear()} Butterfly AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
