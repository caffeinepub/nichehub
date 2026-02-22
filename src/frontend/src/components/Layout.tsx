import { ReactNode } from 'react';
import { SiFacebook, SiInstagram, SiTiktok } from 'react-icons/si';
import { Heart, LogIn, LogOut, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState, useEffect } from 'react';
import HelpModal from './HelpModal';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { login, clear, isLoginSuccess, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const [showHelp, setShowHelp] = useState(false);

  // Handle login errors with toast notifications
  useEffect(() => {
    if (isLoginError && loginError) {
      toast.error('Login Failed', {
        description: loginError.message || 'Unable to authenticate. Please try again.',
      });
    }
  }, [isLoginError, loginError]);

  // Handle successful login
  useEffect(() => {
    if (isLoginSuccess) {
      toast.success('Login Successful', {
        description: 'You are now authenticated.',
      });
    }
  }, [isLoginSuccess]);

  const handleLogin = () => {
    try {
      login();
    } catch (error) {
      toast.error('Login Error', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      clear();
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast.error('Logout Error', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">NicheHub</h1>
              <p className="text-sm text-muted-foreground mt-1">Content Management & Scheduling</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelp(true)}
                title="Help"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
              {isLoginSuccess ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  size="sm"
                  className="gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 overflow-auto">
        {children}
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <SiFacebook className="w-5 h-5 text-muted-foreground" />
            <SiInstagram className="w-5 h-5 text-muted-foreground" />
            <SiTiktok className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Built with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} NicheHub. All rights reserved.
          </p>
        </div>
      </footer>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
