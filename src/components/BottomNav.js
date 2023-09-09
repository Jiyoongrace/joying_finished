import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './css/BottomNav.css';

const BottomNav = ({ isLoggedIn, role }) => {
  const location = useLocation();

  const selectedIconStyle = {
    fontSize: '30px',
    padding: '10px',
    color: '#B8C2FF', // Change this to your desired color
  };

  return (
    <BottomNavigation className="bottom-nav">
      <Link to="/calendar">
        <BottomNavigationAction
          icon={<CalendarMonthIcon style={location.pathname === '/calendar' ? selectedIconStyle : { fontSize: '30px', padding: '10px' }} />}
          selected={location.pathname === '/calendar'}
        />
      </Link>
      <Link to="/lesson-diary">
        <BottomNavigationAction
          icon={<ListIcon style={location.pathname === '/lesson-diary' ? selectedIconStyle : { fontSize: '30px', padding: '10px' }} />}
          selected={location.pathname === '/lesson-diary'}
        />
      </Link>
      <Link to="/grade-history-teacher">
        <BottomNavigationAction
          icon={<BarChartIcon style={location.pathname === '/grade-history-teacher' ? selectedIconStyle : { fontSize: '30px', padding: '10px' }} />}
          selected={location.pathname === '/grade-history-teacher'}
        />
      </Link>
      <Link to="/notification">
        <BottomNavigationAction
          icon={<NotificationsIcon style={location.pathname === '/notification' ? selectedIconStyle : { fontSize: '30px', padding: '10px' }} />}
          selected={location.pathname === '/notification'}
        />
      </Link>
      <Link to="/welcome">
        <BottomNavigationAction
          icon={<AccountCircleIcon style={location.pathname === '/welcome' ? selectedIconStyle : { fontSize: '30px', padding: '10px' }} />}
          selected={location.pathname === '/welcome'}
        />
      </Link>
    </BottomNavigation>
  );
};

export default BottomNav;
