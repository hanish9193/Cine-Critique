import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Film, Menu, User, LogOut, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="bg-[var(--cinema-gray)]/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Film className="text-[var(--cinema-gold)] text-2xl" />
              <h1 className="text-2xl font-playfair font-bold text-white">CineReview</h1>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="text-white hover:text-[var(--cinema-gold)] transition-colors cursor-pointer">
                Movies
              </span>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <span className="text-white hover:text-[var(--cinema-gold)] transition-colors cursor-pointer">
                  Dashboard
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-[var(--cinema-dark)] px-3 py-2 rounded-lg">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="text-sm text-white">
                    {user?.firstName || user?.email || "User"}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-white hover:bg-[var(--cinema-gray)]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-[var(--cinema-gold)] text-black hover:bg-yellow-400 font-semibold"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[var(--cinema-gray)] border-gray-600">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <span className="text-white cursor-pointer w-full">Movies</span>
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <span className="text-white cursor-pointer w-full flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                      </span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAuthenticated ? (
                  <DropdownMenuItem onClick={handleLogout} className="text-white cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleLogin} className="text-white cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
