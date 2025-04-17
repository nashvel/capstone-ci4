import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  title?: string;
  links?: { text: string; link: string }[];
  active?: string;
  buttons?: React.ReactNode;
  customStyle?: React.CSSProperties; // Accept custom styles
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  title = window.innerWidth <= 768 ? " " : "Dashboard",
  links = [], 
  active = '', 
  buttons, 
  customStyle 
}) => {
  return (
    <div 
      className="flex flex-col page-header-breadcrumb gap-4 mb-4 p-4 rounded" 
      style={customStyle} // Apply custom styles
    >
      {/* 🟢 Title with Vertical Spacing */}
      <h1 className="page-title font-medium text-lg mb-5">{title}</h1>

      {/* 🟢 Breadcrumb Navigation with Extra Top Spacing */}
      <nav>
        <ol className="flex items-center whitespace-nowrap min-w-0 pt-2 pb-2">
          <li className="text-sm">
            <Link className="flex items-center text-primary hover:text-primary dark:text-primary" to="/">
              <span className="bi bi-house-door"></span>
              <span className="px-2">Home</span>
              <span className="bi bi-chevron-right px-3"></span>
            </Link>
          </li>
          {links.map((link, index) => (
            <li key={index} className="text-sm">
              <Link className="flex items-center text-primary hover:text-primary dark:text-primary" to={link.link}>
                <span className="px-2">{link.text}</span>
                <span className="bi bi-chevron-right px-3"></span>
              </Link>
            </li>
          ))}
          {active && (
            <li className="text-sm">
              <span className="text-gray-500 dark:text-[#8c9097] dark:text-white/50">{active}</span>
            </li>
          )}
        </ol>
      </nav>

      {/* 🟢 Buttons Section with Margin for Spacing */}
      {buttons && <div className="btn-lists mt-2">{buttons}</div>}
    </div>
  );
};

export default Breadcrumb;
