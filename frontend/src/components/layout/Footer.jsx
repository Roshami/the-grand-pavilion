import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="bg-burgundy-600 text-cream-50 rounded-lg mr-2">
                <img
                  src="/logo.jpg"
                  alt="The Grand Pavilion Logo"
                  className="h-20 w-20 object-cover rounded-lg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50 ml-2">
                The Grand Pavilion
              </span>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              Where Every Moment Becomes a Celebration. Experience exceptional
              cuisine and unforgettable events in an elegant setting.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/venue"
                  className="text-gray-400 hover:text-white transition"
                >
                  Venue
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-gray-400 hover:text-white transition"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-gray-400 hover:text-white transition"
                >
                  Book a Table
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 123 Main Street, Colombo 00100</li>
              <li>📞 +94 11 234 5678</li>
              <li>📧 info@grandpavilion.lk</li>
              <li>⏰ Mon-Sun: 10:00 AM - 10:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} The Grand Pavilion. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
