import quidiLogo from "@/assets/quidi-logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="border-b border-border bg-background px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-6">
          <img src={quidiLogo} alt="Quidi" className="h-10" />
          <nav className="flex items-center gap-4">
            <Button 
              variant="default"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Process Invoices
            </Button>
            <button className="text-foreground hover:text-primary transition-colors font-medium">
              Admin Dashboard
            </button>
          </nav>
        </div>

        {/* Right: User Welcome */}
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Welcome back, Admin</span>
          <Avatar className="h-9 w-9 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
