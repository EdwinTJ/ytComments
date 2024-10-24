import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, UserCircle, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const pages = [
    {
      icon: <Video className="w-10 h-10 mb-4 text-blue-500" />,
      title: "Videos Dashboard",
      description:
        "View all your YouTube videos in one place. Get quick access to view counts, likes, and navigate to AI analysis.",
      path: "/videos",
      buttonText: "Go to Videos",
    },
    {
      icon: <Brain className="w-10 h-10 mb-4 text-purple-500" />,
      title: "Video Analysis by ID",
      description:
        "Enter any YouTube video ID to get AI-powered analysis of comments and engagement. Perfect for analyzing specific videos in detail.",
      path: "/videoById",
      buttonText: "Analyze Video",
    },
    {
      icon: <UserCircle className="w-10 h-10 mb-4 text-yellow-500" />,
      title: "Account Settings",
      description:
        "Manage your account details, view your channel information, and handle logout functionality.",
      path: "/account",
      buttonText: "Manage Account",
    },
  ];

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <img
            src="/logobg.png"
            alt="InsightFlow Logo"
            className="mx-auto w-28 h-auto mb-6"
          />
          <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">InsightFlow</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your YouTube analytics and AI insights platform. Explore our
            features:
          </p>
        </section>

        {/* Quick Start */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-gray-600 mb-10">
            Begin by viewing your videos or analyzing a specific video ID.
          </p>
          <div className="flex gap-6 justify-center">
            <Button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-lg"
              onClick={() => navigate("/videos")}
            >
              View My Videos
            </Button>
            <Button
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-lg"
              onClick={() => navigate("/videoById")}
            >
              Analyze by ID
            </Button>
          </div>
        </section>

        {/* Pages Guide */}
        <section className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {pages.map((page, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">{page.icon}</div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold mb-2">{page.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {page.description}
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(page.path)}
                  >
                    {page.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
