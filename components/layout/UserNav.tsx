import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from '@/components/providers/LanguageProvider';

export function UserNav() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;
  const { t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
     return <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse" />;
  }

  if (!user) {
    return (
      <Button asChild variant="secondary" size="sm" className="font-bold bg-white text-primary hover:bg-white/90">
        <Link href="/login">
          {t.auth.login}
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/20 p-0 overflow-hidden hover:opacity-90 transition-opacity focus-visible:ring-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
            <AvatarFallback className="bg-primary-foreground text-primary font-bold">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || (t.auth.profile)}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t.auth.profile}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Trophy className="mr-2 h-4 w-4" />
            <span>{t.auth.myTeams}</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.auth.settings}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSignOut()} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.auth.logout}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
