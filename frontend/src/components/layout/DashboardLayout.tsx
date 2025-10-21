import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, User, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar Navigation */}
      <nav className="flex h-full w-64 flex-col border-r bg-background p-4">
        <h1 className="mb-6 text-2xl font-bold">Aspiria</h1>
        <div className="grow">
          <Button
            variant="ghost"
            className="w-full justify-start text-base"
            onClick={() => navigate('/dashboard/chat')}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-base"
            onClick={() => navigate('/dashboard/profile')}
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-auto w-full items-center justify-start p-2">
              <Avatar className="mr-2 h-8 w-8">
                <AvatarImage src="https.github.com/shadcn.png" alt={user?.full_name} />
                <AvatarFallback>{user ? getInitials(user.full_name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">{user?.full_name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}