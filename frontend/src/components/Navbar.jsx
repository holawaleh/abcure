import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { accessToken, isAdmin, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="AB Cure" className="h-9 w-9 object-contain" />
          <div className="leading-tight">
            <span className="block text-lg font-bold text-brand-dark">AB Cure</span>
            <span className="hidden sm:block text-[10px] uppercase tracking-wide text-gray-400">
              Herbal &amp; Holistic Wellness
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {accessToken && isAdmin ? (
            <>
              <Link to="/admin" className="text-gray-600 hover:text-brand-dark font-medium transition-colors">
                Admin
              </Link>
              <button onClick={logout} className="text-gray-500 hover:text-brand-dark transition-colors">
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-500 hover:text-brand-dark transition-colors">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
