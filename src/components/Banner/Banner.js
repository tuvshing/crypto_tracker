import React from 'react'
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/material'
const useStyles = makeStyles(() => ({
    banner: {
        backgroundImage: "url(./ales-krivec-unsplash-small.jpg)",
    },
    bannerContent:  {
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 25,
        justifyContent: 'space-around'
    }
}))


const Banner = () => {
    const classes = useStyles()

    return (
        <div className={classes.banner} >
        <Container className={classes.bannerContent}> 
        </Container>
        </div>

    )
}

export default Banner