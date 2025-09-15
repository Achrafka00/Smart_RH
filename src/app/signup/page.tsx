
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { enrollFace } from '@/ai/flows/enroll-face';
import { addEmployee } from '@/lib/services/employee.service';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [isFaceSignupOpen, setIsFaceSignupOpen] = useState(false);
  const [isFaceProcessing, setIsFaceProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isFaceSignupOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };
      getCameraPermission();
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isFaceSignupOpen, toast]);


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

  const handleFaceSignup = async () => {
    if (!videoRef.current || hasCameraPermission === false) {
      toast({ variant: 'destructive', title: 'Camera Not Ready' });
      return;
    }
     if (!name || !email) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter your name and email before enrolling your face.',
      });
      return;
    }

    setIsFaceProcessing(true);
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');

      try {
        const { success, userId } = await enrollFace({ photoDataUri: dataUri, name, email });
        if (success) {
          toast({
            title: 'Face Enrolled Successfully!',
            description: 'Your account has been created. You can now log in.',
          });
          router.push('/login');
        } else {
          toast({ variant: 'destructive', title: 'Enrollment Failed', description: 'Could not create account.' });
        }
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'An Error Occurred', description: 'Could not process face enrollment.' });
      }
    }
    setIsFaceProcessing(false);
    setIsFaceSignupOpen(false);
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
              <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" type="submit" disabled={isSigningUp}>
                {isSigningUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
          </form>
          <Separator className="my-4" />
           <Dialog open={isFaceSignupOpen} onOpenChange={setIsFaceSignupOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Sign up with Face Recognition
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Face Recognition Signup</DialogTitle>
                    <DialogDescription>Enter your name and email, then position your face in the frame.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="face-name">Full Name</Label>
                        <Input id="face-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="face-email">Email</Label>
                        <Input id="face-email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                        <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                         {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <p className="text-center text-white">Camera access is required.</p>
                            </div>
                        )}
                    </div>
                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button onClick={handleFaceSignup} disabled={hasCameraPermission !== true || isFaceProcessing}>
                        {isFaceProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
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
