import { Box, useTheme } from '@mui/material';
import { tokens } from '~/theme';

const ProgressCircle = ({ progress = '0.75', size = '40' }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const angle = progress * 360;
    return (
        <Box
            sx={{
                background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, var(--button-color-primary) ${angle}deg 360deg),
            var(--primary)`,
                borderRadius: '50%',
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};

export default ProgressCircle;
