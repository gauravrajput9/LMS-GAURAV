import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { loadUser, updateUser } from "@/api/authApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProfileCourseCard from "@/components/ui/CourseCardsProfile";

const ProfileSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-6 pt-16 animate-pulse">
    <div className="h-6 w-32 mb-6 rounded bg-gray-300 dark:bg-gray-700" />
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="h-32 w-32 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="space-y-4 w-full">
        <div className="h-4 w-40 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-60 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-10 w-36 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
    <div className="mt-10">
      <div className="h-6 w-60 mb-6 rounded bg-gray-300 dark:bg-gray-700" />
      <div className="flex flex-wrap gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-52 w-64 rounded-lg bg-gray-300 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const loadUserMutation = useMutation({
    mutationFn: loadUser,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error("Failed to load user:", error);
    },
  });

  const { isLoading, data } = loadUserMutation;

  useEffect(() => {
    loadUserMutation.mutate();
  }, []);

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast.success(data.message);
      loadUserMutation.mutate();
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.log("Error from updateUserMutation:", error);
    },
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    updateUserMutation.mutate(formData);
  };

  const { isPending } = updateUserMutation;

  if (isLoading || !data) return <ProfileSkeleton />;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-16">
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        PROFILE
      </h2>
      <div className="flex flex-col sm:flex-row items-start gap-6 bg-white dark:bg-gray-900 shadow-2xl p-6 rounded-2xl transform transition-transform hover:scale-[1.02] duration-500">
        <Avatar className="h-32 w-32 shadow-xl ring-2 ring-purple-400">
          <AvatarImage src={data?.user.photoUrl} />
          <AvatarFallback>GR</AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full">
          <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
            Name: <span className="font-normal text-gray-600 dark:text-gray-300">{data?.user.name}</span>
          </p>
          <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
            Email: <span className="font-normal text-gray-600 dark:text-gray-300">{data?.user.email}</span>
          </p>
          <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
            Role: <span className="font-normal text-gray-600 dark:text-gray-300">{data?.user.role.toUpperCase()}</span>
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleFormSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      id="name-1"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      name="name"
                      placeholder="Enter your Name..."
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Profile Image</Label>
                    <Input
                      type="file"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                      accept="image/*"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button id="closeDialog" variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending} className="bg-gray-800">
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2 text-white bg-gray-700" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-6">
          Enrolled Courses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.user.enrolledCourses.length === 0 ? (
            <p className="font-extrabold text-3xl text-gray-800 mt-5">
              You haven't enrolled yet..
            </p>
          ) : (
            data?.user.enrolledCourses.map((course) => (
              <ProfileCourseCard key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;