import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"

export const metadata = {
  title: "Contact | Jaiden Dill-Jackson",
  description: "Get in touch with Jaiden Dill-Jackson for photography inquiries, collaborations, or bookings.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">Get in Touch</h1>
          <p className="text-lg md:text-xl text-[#999999] max-w-3xl leading-relaxed animate-fade-in-up">
            Interested in working together? I'd love to hear from you. Whether it's a project inquiry, collaboration, or
            just to say hello, feel free to reach out.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg glass flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Email</h3>
                      <a
                        href="mailto:contact@jaidendilljackson.com"
                        className="text-[#999999] hover:text-[#e50914] transition-colors duration-300"
                      >
                        contact@jaidendilljackson.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg glass flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Location</h3>
                      <p className="text-[#999999]">United Kingdom</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
                <ul className="space-y-3">
                  {[
                    "Aviation Photography",
                    "Landscape Photography",
                    "Portrait Sessions",
                    "Event Coverage",
                    "Commercial Projects",
                  ].map((service) => (
                    <li key={service} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e50914] flex-shrink-0" />
                      <span className="text-[#e6e6e6]">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Response Time</h2>
                <p className="text-[#999999] leading-relaxed">
                  I typically respond to inquiries within 24-48 hours. For urgent requests, please mention it in your
                  message.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#999999] text-sm">
            © {new Date().getFullYear()} Jaiden Dill-Jackson. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
