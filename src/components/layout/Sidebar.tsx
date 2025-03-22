
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Server, 
  Network, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight,
  MonitorSmartphone
} from 'lucide-react';

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/',
    description: 'Overview of your network'
  },
  { 
    name: 'Equipment', 
    icon: Server, 
    path: '/equipment',
    description: 'Manage network devices'
  },
  { 
    name: 'Network Map', 
    icon: Network, 
    path: '/network',
    description: 'Visual network diagram'
  },
  { 
    name: 'Connections', 
    icon: MonitorSmartphone, 
    path: '/connections',
    description: 'Manage device connections'
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    path: '/settings',
    description: 'System configuration'
  }
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <div 
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Network className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">NetTracker</span>
          </div>
        )}
        {collapsed && <Network className="h-6 w-6 text-primary mx-auto" />}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  location.pathname === item.path ? "text-primary" : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
                )} />
                
                {!collapsed && (
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {location.pathname === item.path && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 animate-slide-in">
                        {item.description}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Need help with NetTracker?
            </div>
            <Link to="/help" className="text-primary text-sm flex items-center gap-2 hover:underline">
              <HelpCircle className="h-4 w-4" />
              <span>View Documentation</span>
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <Link to="/help">
              <HelpCircle className="h-5 w-5 text-gray-500 hover:text-primary transition-colors duration-200" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
