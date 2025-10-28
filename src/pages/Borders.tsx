import { Shield, FileCheck, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";

const Borders = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold">Border Information</h1>
        <p className="text-sm text-muted-foreground">Requirements & Guidelines</p>
      </header>

      <main className="p-4 space-y-6">
        {/* Current Trip Border Info */}
        <Card className="overflow-hidden">
          <div className="bg-primary/10 p-4">
            <h2 className="font-bold text-lg">Iran → Canada (Vancouver)</h2>
            <p className="text-sm text-muted-foreground">Your upcoming trip</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Visa Requirements</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Electronic Travel Authorization (eTA) required. Processing time: 3-5 business days.
                </p>
                <Button variant="link" className="h-auto p-0 mt-2">
                  Apply for eTA →
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent flex-shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Customs Declaration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete customs declaration form before arrival. Digital form available on Air Canada app.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Processing Time</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Average wait time at Vancouver customs: 30-45 minutes
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Important Documents */}
        <Card className="p-4">
          <h2 className="font-bold mb-4">Required Documents</h2>
          <div className="space-y-3">
            {[
              { doc: "Valid Passport", status: "Verified", variant: "default" as const },
              { doc: "eTA Authorization", status: "Pending", variant: "secondary" as const },
              { doc: "Return Ticket", status: "Confirmed", variant: "default" as const },
              { doc: "Proof of Accommodation", status: "Confirmed", variant: "default" as const },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                <span className="font-medium">{item.doc}</span>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Travel Alerts */}
        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Travel Alerts</h3>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>• Enhanced security screening at Dubai International Airport</li>
                <li>• Weather advisory: Heavy snowfall expected in Vancouver</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Customs Allowances */}
        <Card className="p-4">
          <h2 className="font-bold mb-4">Customs Allowances</h2>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground mb-1">Alcohol</p>
                <p className="font-medium">1.5L wine or 1.14L spirits</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Tobacco</p>
                <p className="font-medium">200 cigarettes</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Cash</p>
                <p className="font-medium">Declare if over CAD $10,000</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Gifts</p>
                <p className="font-medium">Up to CAD $800</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Embassy */}
        <Button variant="outline" className="w-full">
          Contact Canadian Embassy in Tehran
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Borders;
