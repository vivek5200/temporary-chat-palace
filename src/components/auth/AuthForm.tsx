
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, implement actual authentication
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, just check for some value
      if (email && password) {
        // Store user info in localStorage (in a real app, use tokens)
        localStorage.setItem('user', JSON.stringify({ username: email.split('@')[0], email }));
        toast.success('Signed in successfully!');
        navigate('/home');
      } else {
        toast.error('Invalid email or password');
      }
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes
      if (email && password && username) {
        // Store user info in localStorage (in a real app, use proper auth)
        localStorage.setItem('user', JSON.stringify({ username, email }));
        toast.success('Account created successfully!');
        navigate('/home');
      } else {
        toast.error('Please fill in all fields');
      }
    }, 1000);
  };

  // For demo, let's add a quick sign in function
  const handleDemoSignIn = () => {
    localStorage.setItem('user', JSON.stringify({ username: 'DemoUser', email: 'demo@example.com' }));
    toast.success('Signed in as Demo User!');
    navigate('/home');
  };

  return (
    <Tabs defaultValue="signin" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground mt-1">Sign in to continue to TempChat</p>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email"
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={handleDemoSignIn} className="w-full">
              Demo User (Skip Sign In)
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="signup">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-1">Sign up to get started with TempChat</p>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <Input 
                id="username"
                placeholder="johndoe" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email-signup" className="text-sm font-medium">Email</label>
              <Input 
                id="email-signup"
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password-signup" className="text-sm font-medium">Password</label>
              <Input 
                id="password-signup"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
              <Input 
                id="confirm-password"
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" onClick={handleDemoSignIn} className="w-full">
              Continue as Demo User
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
