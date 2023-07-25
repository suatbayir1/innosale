import React, { Component } from 'react';
import withRouter from '../../shared/hoc/withRouter';
import { connect } from "react-redux";
import { TextField, Button, Container, Grid, Paper, Typography, createTheme, ThemeProvider, IconButton } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import background from '../images/AdobeStock_358589688-scaled-e1646391921876-1024x1024.jpeg'
import loginLogo from '../images/Logo_InnoSale.png'

const theme = createTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        background: {
            default: grey[100],
        },
    },
    shape: {
        borderRadius: 20,
    },
});

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false, // Eğer true ise şifreyi gösterir, false ise gizler
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Handle login logic here
  };

  render() {
    return (
        
      <div style={{backgroundColor:"#e1f5fe", backgroundImage:`url(${background})`}}>
      <ThemeProvider theme={theme}>
        <Container maxWidth="xs" style={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: grey[800] }}>
              <div> <img src={loginLogo}/> </div>
            </Typography>
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    fullWidth
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    variant="outlined"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    fullWidth
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    type={this.state.showPassword ? 'text' : 'password'} // Görünürlüğü buradan kontrol ediyoruz
                    variant="outlined"
                    color="primary"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={this.handleShowPassword}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained"  startIcon={<LoginRoundedIcon />} style={{backgroundColor:"#25a9e1"}}>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>

      </div>
    );
  }
}



const mstp = (state) => {
    return {

    }
}

const mdtp = (dispatch) => {
    return {

    }
}

export default withRouter(connect(mstp, mdtp)(LoginPage))