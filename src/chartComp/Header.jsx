import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '~/theme';

const Header = ({ title, subtitle }) => {
    const theme = useTheme();
    return (
        <Box mb="30px">
            <Typography
                variant="h2"
                color={'var(--primary)'}
                fontWeight="bold"
                sx={{ m: '0 0 5px 0' }}
                textAlign={'left'}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={'lighten(var(--primary), 20%)'}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default Header;
