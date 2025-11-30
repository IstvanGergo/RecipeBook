import * as React from 'react';
import EditDeleteActions from './EditDeleteActions';
import { styled } from '@mui/material/styles';
import { Divider } from "@mui/material";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

function compareDescription(a, b) {
    if (a.step_number < b.step_number) {
        return -1;
    }
    if (a.step_number > b.step_number) {
        return 1;
    }
    return 0;
}

export default function RecipeReviewCard({ recipe,onEdit, onDelete  }) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 800, marginBottom: 2 }}>
            <CardActions>
                <EditDeleteActions
                    onEdit={() => onEdit(recipe.id)}
                    onDelete={() => onDelete(recipe.id)}
                />
            </CardActions>
            <CardHeader
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
                        <Typography sx={{ marginBottom: 2, marginLeft: 3 }}>{i.ingredient_name} {i.quantity !== 0 ? `${i.quantity}` : ''} {i.measurement_name}</Typography>
                    )) }
                    <Typography align="center" variant="h4" sx={{ marginBottom: 2 }}>Elkészítés</Typography>
                    {recipe.recipe_steps.sort(compareDescription).map(s => (
                        <Typography sx={{ marginBottom: 2, marginLeft: 3 }}>{s.step_description}</Typography>
                    )) }
                </CardContent>
            </Collapse>
        </Card>
    );
}