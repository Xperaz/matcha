// components/ProfileBasicInfo.tsx
'use client';

import Image from 'next/image';
import avatr from '@/public/images/avatar.png'

const ProfileBasicInfo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden relative">
                <Image
                  src={avatr}
                  alt="Profile"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="text-lg text-gray-900 font-medium">John</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="text-lg text-gray-900 font-medium">Doe</div>
              </div>
            </div>

            {/* Fame Rating */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fame Rating
              </label>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">85%</span>
                <span className="text-sm text-gray-500">popularity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBasicInfo;