import React from 'react'
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-sign-in';

class Login extends React.Component {
    state = {
        username: "",
        password: "",
        loading: false,
        userInfo: null,
        userPic: ""
    }
    onChangeHandle(state, value) {
        this.setState({
            [state]: value
        })
    }
    //Login con Asyncstorage a la api de laravel
    doLogin = async () => {
        const { username, password } = this.state;
        if (username && password) {
            const req = {
                "email": username,
                "password": password
            }
            this.setState({ loading: true })
            axios.post('http://192.168.0.13:8000/api/login', req)
                .then(
                    res => {
                        this.setState({ loading: false })
                        AsyncStorage.setItem("access_token", res.data.access_token)
                            .then(
                                res => {
                                    this.props.navigation.navigate('App');
                                }
                            );
                    },
                    err => {
                        console.log('datos incorrectos');
                        this.setState({ loading: false })
                        alert("Datos incorrectos");
                    }
                )
        } else {
            alert("Ingrese email y contraseña");
        }
    }
    //Login con api Laravel sin Asyncstorage
    signin = async () => {
        this.setState({ loading: true })
        await fetch('http://192.168.0.13:8000/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "email": this.state.username, "password": this.state.password })
        }).then(response => response.json())
            .then(resData => {
                this.setState({ loading: false })
                if (resData.success) {
                    //AsyncStorage.setItem("token", resData.data.token);
                    this.props.navigation.navigate('App');
                    console.log(resData);
                } else {
                    this.props.navigation.navigate('Auth');
                    alert("Datos incorrectos");
                    console.log('error al logear');
                }
            });
    }

    // Login con Facebook
    logInFB = async () => {
        try {
            await Facebook.initializeAsync('596465734463630');
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                const response = await fetch('https://graph.facebook.com/me?access_token=' + token + '&fields=id,name,email,picture.type(large)');

                const userInfo = await response.json();
                await fetch('http://192.168.0.13:8000/api/puliredLogin', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer '
                    },
                    body: JSON.stringify({ "provider": "facebook", "token": token })
                })
                    .then(response => response.json())
                    .then(json => {
                        console.log(json.access_token);
                        this.props.navigation.navigate('App', {
                            userId: userInfo.id,
                            userName: userInfo.name,
                            userEmail: userInfo.email,
                            laravelToken: json.access_token
                        });

                        //alert('Logged in!', `Hi ${(await response.json()).name}!`);
                    });
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }
    //Login con Google
    logInGl = async () => {
        try {
            const config = {
                androidClientId: `665487668-bd04qt2d35gavdik18lpu955mojua8cu.apps.googleusercontent.com`,
                scopes: ['profile', 'email']
            }
            const { type, accessToken, user } = await Google.logInAsync(config);
            if (type === 'success') {
                await fetch('http://192.168.0.13:8000/api/puliredLogin', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer '
                    },
                    body: JSON.stringify({ "provider": "google", "token": accessToken })
                });
                this.props.navigation.navigate('App', {
                    userId: user.id,
                    userName: user.name,
                    userEmail: user.email,
                    userPicture: user.photoUrl
                });
            } else {
                console.log("No se pudo ingresar");
                this.props.navigation.navigate('Auth');
                // type === 'cancel'
            }

        } catch{
            console.log("Fracaso");
        }
    }


    render() {
        const { username, password, loading } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.formWrapper}>
                    <View style={styles.formRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Email"
                            placeholderTextColor="#333"
                            value={username}
                            onChangeText={(value) => this.onChangeHandle('username', value)}>
                        </TextInput>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Password"
                            placeholderTextColor="#333"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(value) => this.onChangeHandle('password', value)}>
                        </TextInput>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                ...styles.signInBtn,
                                backgroundColor: loading ? "#ddd" : "#428AF8"
                            }}
                            onPress={() => this.doLogin()}
                            disabled={loading}>
                            <Text style={styles.btnEnterText}>{loading ? "Ingresando..." : "Ingresar"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                marginLeft: 5,
                                marginRight: 5,
                                marginBottom: 10,
                                backgroundColor: "#428AF8",
                            }}
                            onPress={() => this.logInFB()}
                        >
                            <Text style={styles.btnEnterText}> Ingresar con Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 10,
                                marginLeft: 5,
                                marginRight: 5,
                                marginBottom: 10,
                                backgroundColor: "#428AF8",
                            }}
                            onPress={() => this.logInGl()}
                        >
                            <Text style={styles.btnEnterText}> Ingresar con Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}


export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formWrapper: {
        width: "80%"
    },
    formRow: {
        marginBottom: 10
    },
    textInput: {
        backgroundColor: "#ddd",
        margin: 5,
        height: 40,
        paddingHorizontal: 20,
        color: "#333"
    },
    signInBtn: {
        paddingVertical: 10,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10
    },
    btnEnterText: {
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '700',

    },
});
