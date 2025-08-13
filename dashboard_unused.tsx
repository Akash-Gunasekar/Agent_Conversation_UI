import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  FileTextIcon,
  BarChart3Icon,
  ClockIcon,
  UsersIcon,
  DatabaseIcon,
  BellIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  LockIcon,
  SearchIcon,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-48 flex items-center justify-center text-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="container px-4 md:px-6 z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            RegIQ
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-gray-300">
            Your Intelligent Compliance Partner
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Streamline regulatory compliance, mitigate risks, and ensure your organization stays ahead of evolving
            regulations with AI-powered automation and intelligent insights.
          </p>
          <Link href="/login" passHref>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg">
              Start Your Compliance Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="w-full py-16 md:py-24 bg-gray-800">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">The Compliance Challenge</h2>
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
              <AlertTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-300">Ever-Changing Regulations</h3>
              <p className="text-gray-400">
                Keeping up with thousands of regulatory updates across multiple jurisdictions is overwhelming and
                error-prone.
              </p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
              <ClockIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">Manual Processes</h3>
              <p className="text-gray-400">
                Time-consuming manual compliance checks drain resources and increase the risk of human error.
              </p>
            </div>
            <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
              <BarChart3Icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-purple-300">Fragmented Systems</h3>
              <p className="text-gray-400">
                Disconnected compliance tools create blind spots and make it difficult to get a holistic view of your
                compliance posture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="w-full py-16 md:py-24 bg-gray-900">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">RegIQ: Your Complete Compliance Solution</h2>
          <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed text-gray-300 mb-12">
            RegIQ transforms compliance from a burden into a competitive advantage. Our AI-powered platform automates
            regulatory monitoring, streamlines reporting, and provides intelligent insights to help you stay compliant,
            reduce risks, and focus on what matters most – growing your business.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <BellIcon className="h-10 w-10 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Real-time Monitoring</h3>
              <p className="text-gray-400 text-sm">Stay ahead with instant alerts on regulatory changes</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <FileTextIcon className="h-10 w-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Automated Reporting</h3>
              <p className="text-gray-400 text-sm">Generate compliance reports with one click</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <SearchIcon className="h-10 w-10 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Risk Assessment</h3>
              <p className="text-gray-400 text-sm">Identify and prioritize compliance risks intelligently</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors">
              <DatabaseIcon className="h-10 w-10 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Centralized Hub</h3>
              <p className="text-gray-400 text-sm">All compliance data in one secure location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="w-full py-16 md:py-24 bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Comprehensive Compliance Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <ShieldCheckIcon className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Multi-Regulatory Coverage</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                GDPR, HIPAA, SOX, PCI-DSS, Basel III, and 50+ other regulatory frameworks in one platform.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <TrendingUpIcon className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                AI-powered insights predict compliance risks before they become violations.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <UsersIcon className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                Assign tasks, track progress, and ensure accountability across your compliance team.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <LockIcon className="h-12 w-12 text-red-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                Enterprise-grade security with end-to-end encryption and audit trails.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <CheckCircleIcon className="h-12 w-12 text-yellow-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Audit Readiness</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                Maintain audit-ready documentation and evidence collection automatically.
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-col items-center text-center">
                <BarChart3Icon className="h-12 w-12 text-cyan-400 mb-4" />
                <CardTitle className="text-2xl font-semibold text-white">Executive Dashboards</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                Real-time compliance metrics and KPIs for informed decision-making.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Areas Section */}
      <section className="w-full py-16 md:py-24 bg-gray-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Compliance Areas We Cover</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg border border-blue-700">
              <h3 className="text-lg font-semibold mb-3 text-blue-200">Data Privacy</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• GDPR Compliance</li>
                <li>• CCPA Requirements</li>
                <li>• Data Mapping</li>
                <li>• Consent Management</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-lg border border-green-700">
              <h3 className="text-lg font-semibold mb-3 text-green-200">Financial Services</h3>
              <ul className="text-sm text-green-300 space-y-1">
                <li>• SOX Compliance</li>
                <li>• Basel III</li>
                <li>• Anti-Money Laundering</li>
                <li>• Risk Management</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-lg border border-purple-700">
              <h3 className="text-lg font-semibold mb-3 text-purple-200">Healthcare</h3>
              <ul className="text-sm text-purple-300 space-y-1">
                <li>• HIPAA Compliance</li>
                <li>• FDA Regulations</li>
                <li>• Clinical Trials</li>
                <li>• Patient Data Security</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-lg border border-orange-700">
              <h3 className="text-lg font-semibold mb-3 text-orange-200">Technology</h3>
              <ul className="text-sm text-orange-300 space-y-1">
                <li>• PCI-DSS</li>
                <li>• ISO 27001</li>
                <li>• Cybersecurity Frameworks</li>
                <li>• Cloud Compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">How RegIQ Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900 border border-gray-700 shadow-lg">
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Connect & Configure</h3>
              <p className="text-gray-400">
                Integrate with your existing systems and configure compliance profiles tailored to your industry and
                requirements.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900 border border-gray-700 shadow-lg">
              <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Monitor & Analyze</h3>
              <p className="text-gray-400">
                Our AI continuously monitors regulatory changes, analyzes your data, and identifies potential compliance
                gaps.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900 border border-gray-700 shadow-lg">
              <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Act & Report</h3>
              <p className="text-gray-400">
                Receive actionable insights, automate remediation tasks, and generate comprehensive compliance reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-900 to-purple-900 text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Compliance?</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-300">
            Join thousands of organizations that trust RegIQ to keep them compliant, secure, and ahead of regulatory
            changes. Start your free trial today and experience the future of compliance management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" passHref>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 border-t border-gray-800 text-gray-400 text-center">
        <div className="container px-4 md:px-6">
          <p>&copy; {new Date().getFullYear()} RegIQ. All rights reserved. | Empowering Compliance Excellence</p>
        </div>
      </footer>
    </div>
  )
}
