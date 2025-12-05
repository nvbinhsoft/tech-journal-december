import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="animate-fade-in text-center">
          <h1 className="font-serif text-8xl font-bold text-primary/20">404</h1>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="mt-2 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
