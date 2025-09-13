import Link from "next/link";
import { ArrowRight, BarChart, MessageSquare, Settings, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ComponentType, SVGProps } from "react";

const features = [
  {
    icon: MessageSquare,
    title: "No-Code Customization",
    description: "Easily tailor your chatbot's personality and knowledge base without writing code.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Deploy your chatbot and start engaging with users in just a few clicks.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security and reliable infrastructure.",
  },
  {
    icon: BarChart,
    title: "Session History",
    description: "Review and manage all user conversations for quality and insights.",
  },
  {
    icon: Settings,
    title: "Effortless Management",
    description: "Easily activate, deactivate, or update your chatbots anytime.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="from-background to-muted/30 bg-gradient-to-b py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build and manage <span className="text-primary">AI chatbots</span> with ease
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            Create, customize, and deploy intelligent chatbots for your business without writing a single line of code.
            Monitor performance and improve your bots with powerful analytics.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to build powerful chatbots
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            Our platform provides all the tools you need to create, deploy, and manage AI chatbots that engage your
            customers and streamline your business.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mx-auto mt-4 max-w-2xl">
            Create your first chatbot in minutes and start engaging with your customers today.
          </p>
          <div className="mt-10">
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Your First Chatbot <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">Help Halo</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Help Halo. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

type FeatureCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <Icon className="text-primary h-10 w-10" />
        <CardTitle className="mt-4"> {title}</CardTitle>
        <CardDescription> {description} </CardDescription>
      </CardHeader>
    </Card>
  );
}
