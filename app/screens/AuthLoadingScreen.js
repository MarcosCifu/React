import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AsyncStorage } from 'react-native';


class AuthLoadingScreen extends Component {

    constructor() {
        super();
        this.checkToken();
    }
    checkToken = async () => {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
            this.props.navigation.navigate('App', {
                laravelToken: token
            });
        } else {
            this.props.navigation.navigate('Auth');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <Text style={{ alignItems: "center" }}>Cargando...</Text>
            </View>
        )
    }
}
export default AuthLoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
