
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addEmployee } from '@/lib/services/employee.service';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    if (!name || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Please fill in all fields.',
      });
      setIsSigningUp(false);
      return;
    }

    try {
      const avatar = `https://picsum.photos/seed/${name}/200/200`;
      await addEmployee({
        name,
        email,
        avatar,
        role: 'Employee', // Default role for new signups
        team: 'Unassigned', // Default team
      });

      toast({
        title: 'Account Created!',
        description: 'You can now sign in with your credentials.',
      });
      router.push('/login');

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleFaceSignup = () => {
    toast({
        title: 'Coming Soon!',
        description: 'Face recognition signup is not yet available.'
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join TalentFlow and manage your team with ease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" type="submit" disabled={isSigningUp}>
                {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
          </form>
          <Separator className="my-4" />
           <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleFaceSignup}>
              <Camera className="mr-2 h-4 w-4" />
              Sign up with Face Recognition
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
