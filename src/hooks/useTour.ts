import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const useTour = () => {
    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            animate: true,
            steps: [
                {
                    element: '#sidebar',
                    popover: {
                        title: 'Navigation Sidebar',
                        description: 'Use this sidebar to navigate between different modules like Students, Teachers, and Exams.',
                        side: 'right',
                        align: 'start',
                    },
                },
                {
                    element: '[data-tour="sidebar-dashboard"]',
                    popover: {
                        title: 'Dashboard Overview',
                        description: 'Click here to see a high-level overview of your school\'s performance.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="sidebar-students"]',
                    popover: {
                        title: 'Student Management',
                        description: 'Manage student records, enrollments, and details here.',
                        side: 'right',
                    },
                },
                {
                    element: '[data-tour="header-search"]',
                    popover: {
                        title: 'Global Search',
                        description: 'Quickly find students, teachers, or classes from anywhere.',
                        side: 'bottom',
                    },
                },
                {
                    element: '[data-tour="header-theme"]',
                    popover: {
                        title: 'Theme Toggle',
                        description: 'Switch between Light and Dark modes according to your preference.',
                        side: 'bottom',
                    },
                },
                {
                    element: '[data-tour="header-notifications"]',
                    popover: {
                        title: 'Notifications',
                        description: 'Stay updated with important alerts and announcements.',
                        side: 'bottom',
                    },
                },
                {
                    element: '[data-tour="header-profile"]',
                    popover: {
                        title: 'User Profile',
                        description: 'Access your profile settings or log out from here.',
                        side: 'left',
                    },
                },
                {
                    element: '[data-tour="header-help"]',
                    popover: {
                        title: 'Help & Tour',
                        description: 'Click this button anytime to restart this tour.',
                        side: 'bottom',
                    },
                },
            ],
        });

        driverObj.drive();
    };

    return { startTour };
};
