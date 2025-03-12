
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Atom, 
  BookOpen, 
  BrainCircuit, 
  Calculator, 
  ChevronRight, 
  Sparkles, 
  Trophy,
  Users, 
  Wand2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SubjectCard from '@/components/ui/subject-card';
import AnimatedGradientBg from '@/components/ui/animated-gradient-bg';

const featureItems = [
  {
    icon: <BrainCircuit />,
    title: "AI-Powered Learning",
    description: "Personalized learning experience with an AI tutor that adapts to your learning style."
  },
  {
    icon: <Wand2 />,
    title: "Instant Problem Solving",
    description: "Get step-by-step solutions to any math, physics, or chemistry problem."
  },
  {
    icon: <Sparkles />,
    title: "Interactive Learning",
    description: "Engage with interactive visualizations and simulations to understand complex concepts."
  },
  {
    icon: <Trophy />,
    title: "Gamified Experience",
    description: "Earn badges and rewards as you learn and master concepts."
  }
];

const Index = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <AnimatedGradientBg className="min-h-screen pt-32 pb-20 relative flex items-center">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block px-4 py-1 bg-muted rounded-full text-xs font-semibold mb-4"
              >
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Your AI Learning Companion</span>
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Learn <span className="text-gradient">Smarter</span>, Not Harder
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Your personal AI-powered learning companion for Mathematics, Physics, and Chemistry. Get instant help, step-by-step solutions, and personalized learning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button size="lg" className="rounded-full shadow-md">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <Link to="/chat">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Try AI Tutor
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start mt-6 text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                <span>Trusted by 10,000+ students worldwide</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl glass-card border border-white/30 aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/30 opacity-70" />
                <div className="p-8 h-full flex flex-col justify-center items-center">
                  <div className="mb-10 flex justify-center">
                    <div className="relative">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-16 -right-16 w-20 h-20 text-primary opacity-80"
                      >
                        <Atom className="w-full h-full" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-8 -left-8 w-16 h-16 text-secondary opacity-80"
                      >
                        <Calculator className="w-full h-full" />
                      </motion.div>
                      
                      <BrainCircuit className="w-32 h-32 text-primary/90" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-center">AI-Powered Learning</h3>
                  <p className="text-muted-foreground text-center text-sm mb-6">
                    Get instant help with step-by-step explanations for any problem
                  </p>
                  
                  <Button variant="secondary" className="rounded-full shadow-md">
                    <span>Learn More</span>
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-1/4 -right-6 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-1/4 -left-6 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </AnimatedGradientBg>
      
      {/* Subjects Section */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-heading">Choose Your Subject</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a subject to start your personalized learning journey with our AI tutor.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SubjectCard
              title="Mathematics"
              description="Master algebra, calculus, geometry, and more with interactive lessons and problem-solving."
              icon={<Calculator className="w-6 h-6 text-white" />}
              iconBg="bg-primary"
              path="/subjects/math"
            />
            
            <SubjectCard
              title="Physics"
              description="Understand mechanics, electricity, waves, and modern physics with simulations and examples."
              icon={<Atom className="w-6 h-6 text-white" />}
              iconBg="bg-secondary"
              path="/subjects/physics"
            />
            
            <SubjectCard
              title="Chemistry"
              description="Learn organic, inorganic, and physical chemistry with molecular visualizations."
              icon={<BookOpen className="w-6 h-6 text-white" />}
              iconBg="bg-accent"
              path="/subjects/chemistry"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-heading">Why Students Love MathMind</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our platform combines cutting-edge AI with engaging learning experiences to make studying enjoyable and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureItems.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl glass-card border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="page-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-heading">Ready to Transform Your Learning Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who are already learning smarter with our AI-powered platform.
            </p>
            
            <Button size="lg" className="rounded-full shadow-lg">
              <span>Get Started for Free</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
