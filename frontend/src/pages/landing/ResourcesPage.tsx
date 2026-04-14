import Navbar from "@/components/landing/Navbar";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-32 container mx-auto px-6">
        <h1 className="text-4xl font-semibold mb-6">
          Resources
        </h1>

        <p className="text-muted-foreground mb-10">
          Guides, blogs, and curated learning materials.
        </p>

        <div className="space-y-4">
          {["Interview Guide", "DSA Roadmap", "System Design Basics"].map((item, i) => (
            <div key={i} className="p-4 border rounded-lg bg-muted/20">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}