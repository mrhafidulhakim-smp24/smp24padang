"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactPage() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast({
            title: "Message Sent!",
            description: "Thank you for your message. We will get back to you shortly.",
        });
        form.reset();
    }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We're here to help. Contact us with any questions or inquiries.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-headline text-2xl font-bold text-primary">Contact Information</h2>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-6 w-6 text-accent" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">123 Education Lane, Padang, Indonesia</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-6 w-6 text-accent" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+62 123 456 7890</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-6 w-6 text-accent" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">info@duapat.edu</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
