import { useEffect, useState } from "react";
import { User, Settings, CreditCard, Bell, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: User, label: "Personal Information", path: "/profile/personal" },
  { icon: CreditCard, label: "Payment Methods", path: "/profile/payment" },
  { icon: Bell, label: "Notifications", path: "/profile/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/profile/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/profile/help" },
  { icon: Settings, label: "Settings", path: "/profile/settings" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [tripsCount, setTripsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setProfile(profileData);

      const { count } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      
      setTripsCount(count || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary-glow p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white/20">
            <AvatarFallback className="bg-white/20 text-2xl font-bold">
              {getInitials(profile?.full_name || user?.email || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || 'Travel User'}</h1>
            <p className="text-sm text-primary-foreground/80">{profile?.email || user?.email}</p>
            <p className="text-xs text-primary-foreground/60 mt-1">Member since {new Date(user?.created_at || '').getFullYear()}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6 -mt-4">
        {/* Stats Card */}
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{tripsCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Trips</p>
            </div>
            <Separator orientation="vertical" className="mx-auto h-12" />
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-muted-foreground mt-1">Countries</p>
            </div>
            <Separator orientation="vertical" className="mx-auto h-12" />
            <div>
              <p className="text-2xl font-bold text-primary">{tripsCount * 10}</p>
              <p className="text-xs text-muted-foreground mt-1">Points</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="overflow-hidden">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
                {i < menuItems.length - 1 && <Separator />}
              </div>
            );
          })}
        </Card>

        {/* Loyalty Program */}
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">TravEZ Rewards</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {tripsCount * 10} points • {tripsCount > 5 ? 'Gold' : 'Silver'} Member
              </p>
            </div>
            <button className="text-primary font-medium text-sm">
              View Benefits →
            </button>
          </div>
        </Card>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          © 2023 TravEZ WORLD TRANSIT ADVISORY CORP.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
