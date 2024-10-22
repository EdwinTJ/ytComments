import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Brain, Lightbulb, TrendingUp } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 mb-4 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Gain deep insights into your YouTube performance",
    },
    {
      icon: <Brain className="w-8 h-8 mb-4 text-purple-500" />,
      title: "AI-Powered Insights",
      description: "Let AI analyze your comments and spot trends",
    },
    {
      icon: <Lightbulb className="w-8 h-8 mb-4 text-yellow-500" />,
      title: "Content Inspiration",
      description: "Get AI-generated ideas for your next video",
    },
    {
      icon: <TrendingUp className="w-8 h-8 mb-4 text-green-500" />,
      title: "Audience Engagement",
      description: "Understand and grow your viewer base",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">InsightFlow</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your YouTube experience with AI-powered insights and
            analytics. Unlock the potential of your content and audience with
            cutting-edge technology.
          </p>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10 text-center">
            Empower Your Content Creation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-blue-600 text-white py-16 rounded-lg shadow-xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your YouTube Strategy?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join a community of forward-thinking content creators and take your
            channel to new heights with InsightFlow.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(`/account`)}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate(`/videos`)}
            >
              Explore Videos
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
