import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold">Skill Bridge</div>
            <div className="space-x-4">
              <Link to="/login" className="text-white hover:text-primary-200">Login</Link>
            </div>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect Skills with Opportunities</h1>
            <p className="text-xl md:text-2xl mb-8">
              Skill Bridge is the AI-powered platform that connects skilled consultants 
              with the right projects, maximizing talent utilization and project success.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Skill Bridge Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Project</h3>
              <p className="text-gray-600">Define your project requirements, timeline, and required skills.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Matching</h3>
              <p className="text-gray-600">Our advanced algorithm finds the perfect consultant match for your project.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Collaborate & Succeed</h3>
              <p className="text-gray-600">Work together seamlessly on our platform with built-in project management tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">"Skill Bridge transformed how we find specialized talent for our projects. The matching algorithm is impressively accurate."</p>
              <div className="font-semibold">Sarah Johnson</div>
              <div className="text-sm text-gray-500">CTO, TechInnovate</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">"As a consultant, Skill Bridge has connected me with projects that perfectly match my skills and interests."</p>
              <div className="font-semibold">Mark Williams</div>
              <div className="text-sm text-gray-500">Independent DevOps Consultant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join Skill Bridge today and experience the future of consultant-project matching.</p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Skill Bridge</h3>
              <p>Connecting talent with opportunity through AI-powered matching.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white">Twitter</a>
                <a href="#" className="hover:text-white">LinkedIn</a>
                <a href="#" className="hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Skill Bridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 