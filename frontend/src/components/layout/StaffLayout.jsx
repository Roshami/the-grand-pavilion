import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  CalendarIcon, 
  BuildingLibraryIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/staff', icon: HomeIcon },
  { name: 'Today\'s Bookings', href: '/staff/bookings/today', icon: CalendarIcon },
  { name: 'All Bookings', href: '/staff/bookings', icon: ClipboardDocumentListIcon },
  { name: 'Facilities', href: '/staff/facilities', icon: BuildingLibraryIcon },
];

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-emerald-700 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button 
          type="button" 
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 p-2.5 text-white lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">Staff Panel</div>
        <div className="flex items-center gap-x-4 lg:hidden">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-emerald-100">Staff</p>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-emerald-800 shadow-xl">
            <div className="flex h-full flex-col pt-5 pb-4">
              <div className="flex items-center px-4">
                <div className="bg-emerald-600 text-white rounded-lg p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-serif font-bold text-white ml-2">Staff</span>
              </div>
              
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-auto border-t border-emerald-700 pt-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-2 py-2 text-sm font-medium text-red-200 hover:bg-red-600 hover:text-white rounded-md"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:w-64' : 'lg:w-20'
      } bg-emerald-800`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-4 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="bg-emerald-600 text-white rounded-lg p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-serif font-bold text-white ml-2">Staff Panel</span>
              </div>
            ) : (
              <div className="bg-emerald-600 text-white rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={`${
                            isActive
                              ? 'bg-emerald-700 text-white'
                              : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                          } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {sidebarOpen && item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-emerald-100 hover:bg-emerald-700 hover:text-white w-full"
                >
                  {sidebarOpen ? (
                    <>
                      <ChevronLeftIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      Collapse
                    </>
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 shrink-0 mx-auto" aria-hidden="true" />
                  )}
                </button>
                
                <div className={`mt-4 ${sidebarOpen ? '' : 'hidden'}`}>
                  <div className="flex items-center gap-x-4 px-2 py-3 bg-emerald-700 rounded-lg">
                    <div className="shrink-0">
                      <div className="bg-white text-emerald-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                      <p className="text-xs text-emerald-200 capitalize truncate">Staff Member</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="mt-3 flex items-center w-full px-3 py-2 text-sm font-medium text-red-200 hover:bg-red-600 hover:text-white rounded-md"
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} transition-all duration-300`}>
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}