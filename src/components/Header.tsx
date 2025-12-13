import quidiLogo from "@/assets/quidi-logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user?.email || "User";

  return (
    <header className="border-b border-border bg-background px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-6">
          <img src={quidiLogo} alt="Quidi" className="h-10" />
          <nav className="flex items-center gap-4">
          </nav>
        </div>

        {/* Right: User Welcome and Logout */}
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            Welcome, {userEmail}
          </span>
          <Avatar className="h-9 w-9 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
