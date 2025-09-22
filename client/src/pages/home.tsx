import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  BarChart3,
  Phone,
  Star,
  Clock,
  Headphones,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useScrollTo, useScrollPosition } from "@/hooks/use-scroll";
import { apiRequest } from "@/lib/queryClient";
import { ParticleSystem } from "@/components/particles";
import { ServiceCard } from "@/components/service-card";
import { insertContactSchema, type InsertContact } from "@shared/schema";

const services = [
  {
    title: "Lead Generation Agent",
    description: "Automatically identify and qualify potential customers through intelligent data analysis and outreach strategies.",
    icon: BarChart3,
    gradient: "bg-gradient-to-br from-indigo-primary to-purple-secondary",
  },
  {
    title: "Calling Agent",
    description: "Intelligent voice automation for customer outreach, appointment scheduling, and follow-up communications.",
    icon: Phone,
    gradient: "bg-gradient-to-br from-purple-secondary to-cyan-accent",
  },
  {
    title: "Review Management Agent",
    description: "Monitor, respond to, and manage online reviews across multiple platforms to maintain your brand reputation.",
    icon: Star,
    gradient: "bg-gradient-to-br from-cyan-accent to-indigo-primary",
  },
  {
    title: "Follow-Up Agent",
    description: "Automated customer follow-up sequences to nurture leads and maintain relationships throughout the sales cycle.",
    icon: Clock,
    gradient: "bg-gradient-to-br from-indigo-primary to-cyan-accent",
  },
  {
    title: "Customer Support Agent",
    description: "24/7 intelligent customer support with natural language processing and instant resolution capabilities.",
    icon: Headphones,
    gradient: "bg-gradient-to-br from-purple-secondary to-indigo-primary",
  },
];

export default function Home() {
  const scrollTo = useScrollTo();
  const scrollY = useScrollPosition();
  const { toast } = useToast();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message sent successfully!",
        description: data.message,
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-background/80 backdrop-blur-md border-b border-border" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold text-foreground">UnlockHQ</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollTo("hero")} 
                className="nav-link"
                data-testid="link-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollTo("services")} 
                className="nav-link"
                data-testid="link-services"
              >
                Services
              </button>
              <button 
                onClick={() => scrollTo("about")} 
                className="nav-link"
                data-testid="link-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollTo("contact")} 
                className="nav-link"
                data-testid="link-contact"
              >
                Contact
              </button>
            </nav>

            {/* CTA Button */}
            <Button
              onClick={() => scrollTo("contact")}
              className="glow-button px-6 py-2 rounded-lg font-semibold text-primary-foreground hover:bg-transparent"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
          <ParticleSystem />
          
          <div className="container mx-auto px-6 text-center z-10">
            <div className="max-w-4xl mx-auto">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                data-testid="text-hero-heading"
              >
                Unlock the Power of AI Automation
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                data-testid="text-hero-subtitle"
              >
                Save hours per week through this automation system, cut your expenses, and boost profits with 24/7 agent-like AI capabilities.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  onClick={() => scrollTo("contact")}
                  className="glow-button px-12 py-4 rounded-lg text-lg font-semibold text-primary-foreground hover:bg-transparent"
                  data-testid="button-contact-us"
                >
                  Contact Us
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                data-testid="text-services-heading"
              >
                Our AI Agents
              </motion.h2>
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                data-testid="text-services-subtitle"
              >
                Powerful AI-driven solutions designed to automate your business processes and accelerate growth.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  {...service}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Grid Precision Section */}
        <section className="py-20 grid-pattern relative">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Save hours per week through this automation system.
                </h3>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Cut your expenses and boost profits.
                </h3>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-bold gradient-text">
                  24/7 Agent-like AI capabilities driving your business.
                </h3>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  data-testid="text-about-content"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
                    Transforming Business with AI Innovation
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    At UnlockHQ, we specialize in creating intelligent automation solutions that revolutionize how businesses operate. Our mission is to empower organizations with cutting-edge AI technology that reduces costs, increases efficiency, and drives sustainable growth.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Through our expertise in AI automation and agent-style workflows, we help businesses unlock their full potential by implementing smart technology solutions that work around the clock.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <div className="w-full h-96 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg animate-pulse"></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-lg animate-pulse" style={{animationDelay: '1.5s'}}></div>
                        <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                        <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg animate-pulse" style={{animationDelay: '2.5s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 gradient-bg">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  data-testid="text-contact-heading"
                >
                  Let's Transform Your Business
                </motion.h2>
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  data-testid="text-contact-subtitle"
                >
                  Ready to unlock the power of AI automation? Get in touch with us today.
                </motion.p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div 
                  className="bg-card rounded-2xl p-8 border border-border"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                className="form-input"
                                data-testid="input-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@company.com" 
                                className="form-input"
                                data-testid="input-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1 (555) 123-4567" 
                                className="form-input"
                                data-testid="input-phone"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Company Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your company" 
                                className="form-input"
                                data-testid="input-company"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="glow-button w-full py-3 rounded-lg font-semibold text-primary-foreground hover:bg-transparent"
                        disabled={contactMutation.isPending}
                        data-testid="button-submit"
                      >
                        {contactMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </motion.div>

                {/* Contact Info */}
                <motion.div 
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-foreground font-medium" data-testid="text-email">
                            info.unlockhq@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a 
                        href="https://instagram.com/unlockhq_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                        data-testid="link-instagram"
                      >
                        <Instagram className="w-6 h-6 text-muted-foreground hover:text-primary" />
                      </a>
                      
                      <a 
                        href="https://twitter.com/unlockhq_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                        data-testid="link-twitter"
                      >
                        <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary" />
                      </a>
                      
                      <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                        data-testid="link-linkedin"
                      >
                        <Linkedin className="w-6 h-6 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-muted-foreground" data-testid="text-copyright">
              © 2025 UnlockHQ. All rights reserved.
            </div>

            <nav className="flex items-center space-x-8">
              <button onClick={() => scrollTo("hero")} className="nav-link" data-testid="link-footer-home">
                Home
              </button>
              <button onClick={() => scrollTo("services")} className="nav-link" data-testid="link-footer-services">
                Services
              </button>
              <button onClick={() => scrollTo("about")} className="nav-link" data-testid="link-footer-about">
                About
              </button>
              <button onClick={() => scrollTo("contact")} className="nav-link" data-testid="link-footer-contact">
                Contact
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
