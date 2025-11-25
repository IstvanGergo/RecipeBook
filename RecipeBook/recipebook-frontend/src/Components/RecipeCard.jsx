import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export default function RecipeReviewCard({ recipe }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 800 }}>
            <CardHeader
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={recipe.name}
                align="center"
            />
            <CardContent>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                    {recipe.description }
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography align="center" variant="h4" sx={{ marginBottom: 2 }}>Hozzávalók</Typography>
                    {recipe.quantities.map(i => (
                        <Typography sx={{ marginBottom: 2, marginLeft: 3 }}>{i.ingredient_name} {i.quantity} {i.measurement_name}</Typography>
                    )) }
                    <Typography align="center" variant="h4" sx={{ marginBottom: 2 }}>Elkészítés</Typography>
                    {recipe.recipe_steps.map(s => (
                        <Typography sx={{ marginBottom: 2, marginLeft: 3 }}>{s.step_description}</Typography>
                    )) }
                </CardContent>
            </Collapse>
        </Card>
    );
}