import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Button,
  Card,
  ScrollShadow,
  Tooltip,
  Divider,
} from '@nextui-org/react';
import { useMenuStore } from '@/store/menuStore';
import { MENU_ITEMS } from '@/data/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiChevronLeft } from 'react-icons/fi';
import { FaQuestion } from 'react-icons/fa';
import HelpModal from '@/components/modal/helpModal';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { activeId, setActiveId } = useMenuStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleNavigation = (path: string, id: number) => {
    setActiveId(id);
    router.push(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('selectedHostIp');
    };
  }, []);

  const sidebarVariants = {
    expanded: {
      width: '288px',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    collapsed: {
      width: '80px',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const buttonVariants = {
    expanded: { x: 0, opacity: 1 },
    collapsed: { x: -10, opacity: 0 },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 0 },
    settings: { rotate: 180 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="relative overscroll-x-none">
      <motion.div
        initial="expanded"
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="fixed left-0 top-0 z-[1] h-screen ove"
      >
        <Card
          className="h-full duration-300 border-r border-divider shadow-lg rounded-none bg-background/70 backdrop-blur-md">
          <div className="flex flex-col h-full pt-4">
            <div className="flex-grow px-2">
              <div className="flex flex-col gap-1 pl-3">
                {MENU_ITEMS.map((item) => (
                  <Tooltip
                    showArrow
                    key={item.id}
                    placement="right"
                    content={item.name}
                    classNames={{
                      content: [
                        'py-2 px-4',
                        'text-black',
                      ],
                    }}
                  >
                    <Button
                      onClick={() => handleNavigation(item.path, item.id)}
                      className={`w-full justify-start group transition-all duration-300 ${
                        isCollapsed ? 'px-2' : 'px-2'
                      } ${
                        activeId === item.id
                          ? 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30'
                          : 'bg-transparent hover:bg-default-100'
                      }`}
                      startContent={
                        <motion.div
                          variants={iconVariants}
                          whileHover="hover"
                          className={`text-xl ${
                            activeId === item.id ? 'text-primary' : 'text-default-600'
                          }`}
                        >
                          <item.icon />
                        </motion.div>
                      }
                      variant="light"
                    >
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            variants={buttonVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className={`ml-2 text-sm font-medium ${
                              activeId === item.id ? 'text-primary' : 'text-default-600'
                            }`}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </div>
            <div className="px-3">
              <Divider className="my-4" />
            </div>
            <div className="pl-5 pr-2 pb-4 mt-auto">
              <Tooltip
                content={isCollapsed ? 'Management' : ''}
                placement="right"
                delay={200}
              >
                <Button
                  onClick={() => handleNavigation('/management', 6)}
                  className={`w-full justify-start mb-2 ${
                    isCollapsed ? 'px-2' : 'px-4'
                  } ${
                    activeId === 6
                      ? 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30'
                      : 'bg-transparent hover:bg-default-100'
                  }`}
                  startContent={
                    <motion.div
                      variants={iconVariants}
                      whileHover="settings"
                      transition={{ duration: 0.3 }}
                    >
                      <FiSettings className="text-xl" />
                    </motion.div>
                  }
                  variant="light"
                >
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        variants={buttonVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="ml-2"
                      >
                        관리
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Tooltip>

              <Tooltip
                content={isCollapsed ? 'Help' : ''}
                placement="right"
                delay={200}
              >
                <Button
                  onClick={() => setIsHelpOpen(true)}
                  className={`w-full justify-start pl-3 ${
                    isCollapsed ? 'px-2' : 'px-4'
                  }`}
                  startContent={
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      className="text-primary"
                    >
                      <FaQuestion className="text-xl" />
                    </motion.div>
                  }
                  variant="light"
                >
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        variants={buttonVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="ml-2"
                      >
                        도움말
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Tooltip>
            </div>
          </div>
        </Card>
        {isHelpOpen && <HelpModal />}
      </motion.div>
      <div className="fixed" style={{
        left: isCollapsed ? '63px' : '271px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9,
        transition: 'left 0.3s ease-in-out',
      }}>
        <Button
          isIconOnly
          className="bg-white border border-primary/20 rounded-full hover:bg-gray_1"
          size="sm"
          onClick={toggleSidebar}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronLeft />
          </motion.div>
        </Button>
      </div>

    </div>
  );
};

export default Header;
