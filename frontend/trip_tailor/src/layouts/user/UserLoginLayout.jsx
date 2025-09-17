import { Outlet } from 'react-router-dom';
import loginImage from '../../assets/authentication/login_image.png'; 

const UserLoginLayout = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-[Lexend]">
      <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden border border-gray-200">
        
        {/* Left side - Image */}
        <div className="w-1/2 bg-white hidden md:flex items-center justify-center p-4">
          <img
            src={loginImage}
            alt="Illustration"
            className="max-h-[400px] w-auto object-contain"
          />
        </div>


        {/* Right side - Outlet */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default UserLoginLayout;
