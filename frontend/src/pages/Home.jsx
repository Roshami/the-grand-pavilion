import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-burgundy-900 to-burgundy-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Where Every Moment Becomes a Celebration
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 max-w-3xl mx-auto mb-8">
            Experience exceptional cuisine and unforgettable events in Colombo's
            most elegant venue
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/booking"
              className="bg-gold-400 text-burgundy-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-gold-300 transition transform hover:scale-105"
            >
              Book a Table
            </Link>
            <Link
              to="/venue"
              className="bg-transparent border-2 border-cream-100 text-cream-100 font-bold px-8 py-4 rounded-lg text-lg hover:bg-cream-100 hover:text-burgundy-900 transition"
            >
              Explore Venue
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-burgundy-800 mb-4">
              Our Offerings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From intimate dinners to grand celebrations, we provide the
              perfect setting for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dining */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-linear-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-burgundy-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 16.5v-9a3 3 0 00-6 0v9m6 0H7m10 0l-3 3m3-3l3 3"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-burgundy-800 mb-2">
                  Fine Dining
                </h3>
                <p className="text-gray-600 mb-4">
                  Enjoy our exquisite menu in an elegant atmosphere perfect for
                  romantic dinners and family gatherings.
                </p>
                <Link
                  to="/menu"
                  className="text-burgundy-600 font-medium hover:text-burgundy-800"
                >
                  View Menu →
                </Link>
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-linear-to-br from-rose-50 to-rose-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-burgundy-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-burgundy-800 mb-2">
                  Event Hall
                </h3>
                <p className="text-gray-600 mb-4">
                  Host weddings, birthdays, and corporate events in our
                  beautifully designed halls with full catering services.
                </p>
                <Link
                  to="/venue"
                  className="text-burgundy-600 font-medium hover:text-burgundy-800"
                >
                  View Halls →
                </Link>
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-burgundy-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-burgundy-800 mb-2">
                  Event Packages
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose from our curated packages for weddings, birthdays, and
                  corporate events with customizable options.
                </p>
                <Link
                  to="/booking"
                  className="text-burgundy-600 font-medium hover:text-burgundy-800"
                >
                  View Packages →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-burgundy-800 text-cream-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-xl text-cream-200 mb-8 max-w-2xl mx-auto">
            Let us help you plan the perfect celebration. Our dedicated team is
            here to make your vision a reality.
          </p>
          <Link
            to="/booking"
            className="inline-block bg-gold-400 text-burgundy-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-gold-300 transition transform hover:scale-105"
          >
            Book Your Event Today
          </Link>
        </div>
      </section>
    </div>
  );
}
