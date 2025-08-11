import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon, LightbulbIcon, ShieldCheckIcon, WorkflowIcon, QuoteIcon } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-foreground01 text-background flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center">
        <div className="container px-4 md:px-6 z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6">
            Welcome to RegIQ
          <div className="relative">
            Your Compliance Partner
          </div>
            
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

      {/* About RegIQ Section */}
      <section className="w-full py-16 md:py-24 bg-background text-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">About RegIQ</h2>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            RegIQ is an innovative platform designed to simplify and automate regulatory compliance for businesses of
            all sizes. We understand the complexities of navigating ever-changing regulations, and our mission is to
            provide a robust, intuitive solution that ensures your operations remain compliant, secure, and efficient.
            From automated reporting to real-time risk assessment, RegIQ empowers you to focus on growth while we handle
            the intricacies of compliance.
          </p>
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

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-background text-foreground">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How RegIQ Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-foreground01 text-background shadow-lg">
              <WorkflowIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">1. Configure Your Needs</h3>
              <p className="text-muted-foreground">
                Easily set up your compliance profiles and integrate with your existing systems.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-foreground01 text-background shadow-lg">
              <LightbulbIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">2. Automate Monitoring</h3>
              <p className="text-muted-foreground">
                RegIQ continuously monitors regulatory changes and your operational data.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-foreground01 text-background shadow-lg">
              <ShieldCheckIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">3. Ensure Compliance</h3>
              <p className="text-muted-foreground">
                Receive real-time alerts and generate comprehensive reports to maintain compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your IQ?
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-primary-foreground/90">
            Unlock the full potential of your knowledge. Our intelligent platform helps you 
            learn faster, think smarter, and make better decisions — whether you're preparing 
            for big goals or simply expanding your curiosity.
          </p>
          <Link href="/login" passHref>
            <Button
              size="lg"
              variant="secondary"
              className="bg-[var(--chart-6)] text-black hover:bg-[var(--chart-7)]"
            >
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>


      {/* Footer */}
      <footer className="w-full py-8 bg-foreground01 text-muted-foreground text-center">
        <div className="container px-4 md:px-6">
          <p>&copy; {new Date().getFullYear()} RegIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
