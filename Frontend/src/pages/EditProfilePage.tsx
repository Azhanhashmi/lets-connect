import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUpdateProfile, useUploadAvatar } from '../hooks/useProfile';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';

export const EditProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    displayName: user?.profile?.displayName || '',
    bio: user?.profile?.bio || '',
    lookingFor: user?.profile?.lookingFor || '',
  });

  const [interests, setInterests] = useState<string[]>(
    user?.profile?.interests || []
  );

  const [newInterest, setNewInterest] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.profile?.displayName || '',
        bio: user.profile?.bio || '',
        lookingFor: user.profile?.lookingFor || '',
      });

      setInterests(user.profile?.interests || []);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile.mutateAsync({
        ...form,
        interests,
      });

      setUser({
        ...user!,
        profile: updatedProfile,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    uploadAvatar.mutate(file);
  };

  const addTag = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
    setVal: (v: string) => void
  ) => {
    const trimmed = val.trim();

    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }

    setVal('');
  };

  const removeTag = (
    list: string[],
    setList: (v: string[]) => void,
    tag: string
  ) => {
    setList(list.filter((t) => t !== tag));
  };

  return (
    <div className="px-5 pt-12 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="font-serif text-xl text-[#1A1A1A]">
          Edit profile
        </h1>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Avatar
            src={avatarPreview || user?.profile?.avatar || undefined}
            name={user?.profile?.displayName}
            size="xl"
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-lg"
          >
            {uploadAvatar.isPending ? (
              <Spinner size={14} color="#FFFEFD" />
            ) : (
              <Camera size={15} className="text-white" />
            )}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-sans mb-1.5">
            Display name
          </label>

          <input
            className="input-field"
            placeholder="Your name"
            value={form.displayName}
            onChange={(e) =>
              setForm({
                ...form,
                displayName: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-sans mb-1.5">
            Bio
          </label>

          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Tell people about yourself..."
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-sans mb-1.5">
            Looking for
          </label>

          <input
            className="input-field"
            placeholder="e.g. Creative collaborators"
            value={form.lookingFor}
            onChange={(e) =>
              setForm({
                ...form,
                lookingFor: e.target.value,
              })
            }
          />
        </div>

        {/* Interests */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/40 font-sans mb-2">
            Interests
          </label>

          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-black/6 rounded-full text-sm font-sans text-[#1A1A1A]"
              >
                {tag}

                <button
                  onClick={() =>
                    removeTag(interests, setInterests, tag)
                  }
                >
                  <X
                    size={12}
                    className="text-[#1A1A1A]/40"
                  />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="input-field flex-1 py-2.5 text-sm"
              placeholder="Add interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                addTag(
                  interests,
                  setInterests,
                  newInterest,
                  setNewInterest
                )
              }
            />

            <button
              onClick={() =>
                addTag(
                  interests,
                  setInterests,
                  newInterest,
                  setNewInterest
                )
              }
              className="w-10 h-10 rounded-xl bg-black/6 flex items-center justify-center flex-shrink-0"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className={`w-full mt-8 text-base ${
          saved ? 'btn-purple' : 'btn-primary'
        }`}
      >
        {updateProfile.isPending ? (
          <Spinner size={18} color="#FFFEFD" />
        ) : saved ? (
          '✓ Saved!'
        ) : (
          'Save changes'
        )}
      </motion.button>
    </div>
  );
};