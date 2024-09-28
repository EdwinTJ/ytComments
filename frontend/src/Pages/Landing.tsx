import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Youtube, TrendingUpDown, BrainCircuitIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to YourTube AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionize your YouTube experience with AI-powered insights and
            analytics.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 text-center">
            YourTube AI is your ultimate companion for YouTube content creation
            and analysis. We leverage cutting-edge AI technology to provide you
            with deep insights, trend analysis, and content optimization tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Youtube className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Channel Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get in-depth analytics for your YouTube channels. Track
                  performance, audience engagement, and growth metrics all in
                  one place.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUpDown className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Trend Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Stay ahead of the curve with our AI-powered trend prediction.
                  Discover emerging topics and optimize your content strategy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BrainCircuitIcon className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>AI Content Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive personalized content suggestions based on your
                  channel's performance and current trends in your niche.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does YourTube AI work?</AccordionTrigger>
              <AccordionContent>
                YourTube AI integrates with your YouTube account to analyze your
                channel's data. Our AI algorithms process this information to
                provide insights, predict trends, and suggest content ideas
                tailored to your channel's performance and audience preferences.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my YouTube data safe?</AccordionTrigger>
              <AccordionContent>
                We take data privacy very seriously. We only access the data you
                explicitly grant us permission to use, and we employ
                industry-standard security measures to protect your information.
                Your data is never shared or sold to third parties.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I use YourTube AI for multiple channels?
              </AccordionTrigger>
              <AccordionContent>
                Yes! YourTube AI supports multiple channel management. You can
                add and analyze multiple YouTube channels under a single
                account, making it perfect for content creators who manage
                various channels or for agencies working with multiple clients.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate(`/`)}
          >
            Sign Up Now
          </Button>
        </section>
      </main>
    </div>
  );
}
