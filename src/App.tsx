import {
  Container,
  Divider,
  Icon,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { makeStyles } from 'tss-react/mui';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PgnInput from './PgnInput';

const useStyles = makeStyles()((theme) => ({
  wrapper: {
    width: '80%',
    margin: 'auto',
    marginTop: theme.spacing(2),
  },
  header: {
    color: theme.palette.primary.main,
  },
  body: {},
  footer: {
    color: theme.palette.secondary.main,
  },
  padded: {
    padding: theme.spacing(2),
  },
  iconGroup: {
    display: 'inline-flex',
    float: 'right',
    gap: theme.spacing(1),
  },
  icon: {
    verticalAlign: 'middle',
    fontSize: 'inherit',
  },
}));

const App = () => {
  const { classes } = useStyles();

  return (
    <Paper className={classes.wrapper}>
      <Container className={clsx(classes.header, classes.padded)}>
        <Typography variant="h2">Chess Scribe</Typography>
      </Container>
      <Divider />
      <Container className={clsx(classes.body, classes.padded)}>
        <PgnInput />
      </Container>
      <Divider />
      <Container className={clsx(classes.footer, classes.padded)}>
        <Typography variant="body2">
          Made by Benjamin Lehmann
          <span className={classes.iconGroup}>
            <Link href="https://github.com/bclehmann">
              <Icon component={GitHubIcon} className={classes.icon} />
            </Link>
            <Link href="https://www.linkedin.com/in/benjamin-lehmann-a87772206/">
              <Icon component={LinkedInIcon} className={classes.icon} />
            </Link>
          </span>
        </Typography>
      </Container>
    </Paper>
  );
};

export default App;
