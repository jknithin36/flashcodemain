"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLoggedInUser, updateUserProfile } from "@/lib/actions/user.action";

const EditProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    portfolio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { success, data } = await getLoggedInUser(); // must return logged-in user data
      if (success && data) {
        setUserData({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
          location: data.location || "",
          portfolio: data.portfolio || "",
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateUserProfile(userData);
    if (res?.success) {
      router.push(`/profile/${res.data._id}`); // Redirect to updated profile
    } else {
      alert("Update failed!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Edit Your Profile</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <Input
          name="username"
          value={userData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <Textarea
          name="bio"
          value={userData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <Input
          name="location"
          value={userData.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <Input
          name="portfolio"
          value={userData.portfolio}
          onChange={handleChange}
          placeholder="Portfolio link"
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditProfilePage;
