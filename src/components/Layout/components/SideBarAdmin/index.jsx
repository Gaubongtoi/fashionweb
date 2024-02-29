import { useContext, useState } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
// import 'react-pro-sidebar/dist/css/styles.css';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '~/theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import styles from './SideBarAdmin.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { UserContext } from '~/hooks/UserContext';
import AvatarAuto from '~/components/AvatarAuto';
const cx = classNames.bind(styles);

const SideBarAdmin = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState('Dashboard');
    console.log(selected);
    const state = useContext(UserContext);
    console.log(state?.cuser?.value);
    return (
        <div className={cx('sidebar-wrapper')}>
            <Box
                sx={{
                    '& .pro-sidebar-inner': {
                        background: `${colors.primary[400]} !important`,
                        zIndex: '1',
                    },
                    '& .pro-icon-wrapper': {
                        backgroundColor: 'transparent !important',
                    },
                    '& .pro-inner-item': {
                        padding: '5px 35px 5px 20px !important',
                    },
                    '& .pro-inner-item:hover': {
                        color: '#868dfb !important',
                    },
                    '& .pro-menu-item.active': {
                        color: '#6870fa !important',
                    },
                }}
            >
                <ProSidebar collapsed={isCollapsed}>
                    <Menu iconShape="square">
                        {/* LOGO AND MENU ICON */}
                        <MenuItem
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                            style={{
                                margin: '10px 0 20px 0',
                                color: colors.grey[100],
                            }}
                        >
                            {!isCollapsed && (
                                <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                    <Typography variant="h3" color={colors.grey[100]}>
                                        ADMIN
                                    </Typography>
                                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                        <MenuOutlinedIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </MenuItem>

                        {!isCollapsed && (
                            <Box mb="25px">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    {/* <img
                                        alt="profile-user"
                                        width="100px"
                                        height="100px"
                                        src={images.logo}
                                        style={{ cursor: 'pointer', borderRadius: '50%' }}
                                    /> */}
                                    <AvatarAuto nameU={state?.cuser?.value?.name} />
                                </Box>
                                <Box textAlign="center">
                                    <Typography
                                        variant="h2"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                        sx={{ m: '10px 0 0 0' }}
                                        fontSize={'1.6rem'}
                                    >
                                        {state?.cuser?.value?.name}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Dashboard
                                    </Typography>
                                }
                                to="/admin"
                                icon={<HomeOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Manage User
                                    </Typography>
                                }
                                to="/admin/account"
                                icon={<PeopleOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Manage Product
                                    </Typography>
                                }
                                to="/admin/manageProduct"
                                icon={<InventoryIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Add Product
                                    </Typography>
                                }
                                to="/admin/addProduct"
                                icon={<AddBoxIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Manage Orders
                                    </Typography>
                                }
                                to="/admin/manageOrder"
                                icon={<AddBoxIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            <Item
                                title={
                                    <Typography variant="p" style={{ fontSize: '1.6rem' }}>
                                        Manage Returns
                                    </Typography>
                                }
                                to="/admin/manageReturn"
                                icon={<AddBoxIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                            {/* <Typography variant="h6" color={colors.grey[300]} sx={{ m: '15px 0 5px 20px' }}>
                                Products
                            </Typography> */}
                        </Box>
                    </Menu>
                </ProSidebar>
            </Box>
        </div>
    );
};

export default SideBarAdmin;

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // console.log(selected === title);
    console.log();
    return (
        <MenuItem
            active={selected?.props?.children === title?.props?.children}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};
