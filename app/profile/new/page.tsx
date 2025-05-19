"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  skills: z.string().transform((val) => val.split(",").map((s) => s.trim())),
  interests: z.string().transform((val) => val.split(",").map((s) => s.trim())),
  experience: z.string().min(1, "Experience is required"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  preferredRoles: z.string().transform((val) => val.split(",").map((s) => s.trim())),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function NewProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      toast.success("Profile created successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to create profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create Your Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea {...register("bio")} />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Skills (comma-separated)
            </label>
            <Input {...register("skills")} placeholder="React, Node.js, Python" />
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Interests (comma-separated)
            </label>
            <Input
              {...register("interests")}
              placeholder="AI, Web3, Machine Learning"
            />
            {errors.interests && (
              <p className="text-red-500 text-sm mt-1">
                {errors.interests.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <Input {...register("experience")} placeholder="3 years" />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <Input {...register("githubUrl")} placeholder="https://github.com/username" />
            {errors.githubUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.githubUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
            <Input
              {...register("linkedinUrl")}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedinUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.linkedinUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Portfolio URL</label>
            <Input
              {...register("portfolioUrl")}
              placeholder="https://your-portfolio.com"
            />
            {errors.portfolioUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.portfolioUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Roles (comma-separated)
            </label>
            <Input
              {...register("preferredRoles")}
              placeholder="Frontend, Backend, Full-stack"
            />
            {errors.preferredRoles && (
              <p className="text-red-500 text-sm mt-1">
                {errors.preferredRoles.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
} 