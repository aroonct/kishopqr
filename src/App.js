import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  makeStyles,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import QrReader from 'react-qr-reader';
import firebase from './firebase';
import { db } from './firebase';

function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const [userData, setUserData] = useState(null);
  const classes = useStyles();
  const qrRef = useRef(null);

  useEffect(() => {
    if (scanResultWebCam) {
      fetchUserData(scanResultWebCam);
    }
  }, [scanResultWebCam]);

  const fetchUserData = async (userId) => {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserData(userData);
      } else {
        console.log('El usuario no existe');
      }
    } catch (error) {
      console.log('Error al obtener los datos del usuario:', error);
    }
  };

  const handleErrorWebCam = (error) => {
    console.log(error);
  };

  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  };

  return (
    <Container className={classes.container}>
      <Card>
        <h2 className={classes.title}>Kishop - Confirmar identidad</h2>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3>Escanear Codigo QR</h3>
              <QrReader
                delay={300}
                style={{ width: '100%' }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />
              <h3>Resultado: {scanResultWebCam}</h3>
              {userData && (
                <div className={classes.card}>
                  <img className={classes.profileImg} src={userData.imageUrl} alt="Imagen de perfil" />
                  <div className={classes.cardContent}>
                    <p className={classes.cardItem}>DNI: {userData.dni}</p>
                    <p className={classes.cardItem}>Nombre: {userData.nombre}</p>
                    <p className={classes.cardItem}>Apellido: {userData.apellido}</p>
                    <p className={classes.cardItem}>Cargo: {userData.cargo}</p>
                    <p className={classes.cardItem}>Correo: {userData.correo}</p>
                    <p className={classes.cardItem}>Función: {userData.funcion}</p>
                    <p className={classes.cardItem}>Código de Seguridad: ********</p>
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    width: '80%',
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 20,
  },
  profileImg: {
    width: 100,
    borderRadius: '50%',
    marginBottom: 10,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardItem: {
    marginBottom: 5,
  },
}));

export default App;
