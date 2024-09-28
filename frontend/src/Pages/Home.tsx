import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
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
            The videos page get the last 10 videos of the channel selected.
          </p>
        </section>
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/account`)}
          >
            Account
          </Button>
          <hr />
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/videos`)}
          >
            Videos
          </Button>
        </section>
      </main>
    </div>
  );
}
