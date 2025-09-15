
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
import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getEmployees } from '@/lib/services/employee.service';
import { recognizeFace } from '@/ai/flows/face-recognition';
import type { Employee } from '@/lib/types';


export default function LoginPage() {
  const { login } = useRole();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFaceLoginOpen, setIsFaceLoginOpen] = useState(false);
  const [isFaceProcessing, setIsFaceProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isFaceLoginOpen) {
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
        // Cleanup: stop video stream when dialog closes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isFaceLoginOpen, toast]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    if (!email || !password) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please enter both email and password.',
      });
      setIsLoggingIn(false);
      return;
    }

    // This is a more realistic mock authentication.
    const employees = await getEmployees();
    const user = employees.find(e => e.email === email);
    
    // In a real app, you'd use a secure password check. Here we just check for existence.
    if (user) {
        login(user.id);
        router.push('/');
    } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password.',
        });
    }
    setIsLoggingIn(false);
  };
  
  const handleFaceLogin = async () => {
    if (!videoRef.current || hasCameraPermission === false) {
      toast({
        variant: 'destructive',
        title: 'Camera Not Ready',
        description: 'Cannot log in without camera access.',
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
        const { isRecognized, userId } = await recognizeFace({ photoDataUri: dataUri });
        if (isRecognized && userId) {
            toast({
                title: "Face Recognized!",
                description: "Logging you in..."
            });
            login(userId);
            router.push('/');
        } else {
            toast({
                variant: 'destructive',
                title: 'Face Not Recognized',
                description: 'Please try again or use your email and password.',
            });
        }
      } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'An Error Occurred',
            description: 'Could not process face recognition.',
        });
      }
    }
    setIsFaceProcessing(false);
    setIsFaceLoginOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>
            Sign in to your TalentFlow account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hr@talentflow.com or any employee email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter any password" />
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <Separator className="my-4" />
          <Dialog open={isFaceLoginOpen} onOpenChange={setIsFaceLoginOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Sign in with Face Recognition
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Face Recognition Login</DialogTitle>
                    <DialogDescription>Position your face in the center of the frame.</DialogDescription>
                </DialogHeader>
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
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button onClick={handleFaceLogin} disabled={hasCameraPermission !== true || isFaceProcessing}>
                        {isFaceProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
