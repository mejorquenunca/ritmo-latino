
'use client';

import Link from 'next/link';
import { Home, Music, User, PartyPopper, CalendarPlus, LogOut, LogIn, UserPlus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { signOut, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const user = currentUser?.profile;
  const isCreator = user?.role === 'creator';

  const navItems = [
    { href: '/', label: 'Inicio', icon: Home, visible: true },
    { href: '/tson', label: 'TSón', icon: Music, visible: true },
    { href: '/events/create', label: 'Crear Evento', icon: CalendarPlus, visible: isCreator },
  ].filter(item => item.visible);
  
  const handleSignOut = async () => {
    try {
        await signOut(auth);
        toast({ title: "Has cerrado sesión." });
        router.push('/');
        router.refresh();
    } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "No se pudo cerrar la sesión." });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center max-w-4xl mx-auto px-4">
          <div className="mr-auto flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <PartyPopper className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">Ritmo Latino</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-colors hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-foreground/60'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={user.avatar.imageUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <div className="hidden md:flex gap-2">
                    <Button asChild variant="ghost">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4"/> Iniciar Sesión
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">
                            <UserPlus className="mr-2 h-4 w-4"/> Registrarse
                        </Link>
                    </Button>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center justify-around fixed bottom-0 left-0 right-0 h-16 bg-background/95 border-t z-50">
         {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center transition-colors hover:text-primary p-1 rounded-md w-1/4',
                pathname === item.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1 text-center">{item.label}</span>
            </Link>
          ))}
          {user ? (
            <Link
                href="/profile"
                className={cn(
                'flex flex-col items-center justify-center transition-colors hover:text-primary p-1 rounded-md w-1/4',
                pathname === '/profile' ? 'text-primary' : 'text-foreground/60'
                )}
            >
                <User className="h-5 w-5" />
                <span className="text-xs mt-1 text-center">Perfil</span>
            </Link>
          ) : (
             <Link
                href="/login"
                className={cn(
                'flex flex-col items-center justify-center transition-colors hover:text-primary p-1 rounded-md w-1/4',
                pathname === '/login' ? 'text-primary' : 'text-foreground/60'
                )}
            >
                <LogIn className="h-5 w-5" />
                <span className="text-xs mt-1 text-center">Entrar</span>
            </Link>
          )}
      </nav>
    </>
  );
}
