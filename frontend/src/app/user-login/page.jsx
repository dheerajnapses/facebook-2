'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { loginUser, registerUser } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

export default function LoginSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUserStore();

  const registerSchema = yup.object().shape({
    username: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    dateOfBirth: yup.date().required("Birthdate is required"),
    gender: yup.string().oneOf(['male', 'female', 'other'], "Please select a gender").required("Gender is required")
  })

  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().required("Password is required")
  })

  const { register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin } } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const { register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: errorsSignup } } = useForm({
    resolver: yupResolver(registerSchema)
  })

  const onSubmitLogin = async (data) => {
    try {
      setIsLoading(true)
      const result = await loginUser(data);
      setUser(result?.data)
      if(result.status === "success") {
        router.push('/')
      }
      console.log('Login data:', data)
    } catch (error) {
       console.log('error while login',error)
    }finally{
      setIsLoading(false)
    }
  }

  const onSubmitSignup = async (data) => {
    try {
      setIsLoading(true)
      const result = await registerUser(data);
      setUser(result?.data)
      console.log('Signup data:',result)
      if(result.status === "success") {
        router.push('/')
      }
      console.log('signin data:', data)
    } catch (error) {
       console.log('error while login',error)
    }finally{
      setIsLoading(false)
    }
  }


  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <span
              >
                facebook
              </span>
            </CardTitle>
            <CardDescription className="text-center">Connect with friends and the world around you on Facebook.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmitLogin(onSubmitLogin)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginEmail">Email</Label>
                      <Input id="loginEmail" placeholder="Enter your email" type="email" {...registerLogin('email')} />
                      {errorsLogin.email && <p className="text-red-500">{errorsLogin.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginPassword">Password</Label>
                      <Input id="loginPassword" placeholder="Enter your password" type="password" {...registerLogin('password')} />
                      {errorsLogin.password && <p className="text-red-500">{errorsLogin.password.message}</p>}
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSubmitSignup(onSubmitSignup)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signupName">Full Name</Label>
                      <Input id="signupName" placeholder="Enter your full name" {...registerSignup('username')} />
                      {errorsSignup.username && <p className="text-red-500">{errorsSignup.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input id="signupEmail" placeholder="Enter your email" type="email" {...registerSignup('email')} />
                      {errorsSignup.email && <p className="text-red-500">{errorsSignup.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input id="signupPassword" placeholder="Enter your password" type="password" {...registerSignup('password')} />
                      {errorsSignup.password && <p className="text-red-500">{errorsSignup.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupBirthdate">Birthdate</Label>
                      <Input id="signupBirthdate" type="date" {...registerSignup('dateOfBirth')} />
                      {errorsSignup.dateOfBirth && <p className="text-red-500">{errorsSignup.dateOfBirth.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <RadioGroup className='flex justify-between' defaultValue="male" {...registerSignup('gender')}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                      {errorsSignup.gender && <p className="text-red-500">{errorsSignup.gender.message}</p>}
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Signing up..." : "Sign up"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute  inset-0 flex items-center">
                <span className="w-full  border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="light:bg-background  px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="w-full  gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </Button>
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}