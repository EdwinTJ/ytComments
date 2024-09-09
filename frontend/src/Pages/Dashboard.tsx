import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <section className="flex-1 p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <img
            src="/coding.svg?height=200&width=400"
            alt="Card Image"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Your Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            This is your personal dashboard. Here you can manage your account,
            view statistics, and customize your settings.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            Learn More
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-600">
            Get Started
          </Button>
        </CardFooter>
      </Card>{" "}
    </section>
  );
}
