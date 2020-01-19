import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, AsyncStorage, SafeAreaView, ScrollView } from 'react-native';

class Dashboard extends Component {

    doLogout() {
        AsyncStorage.removeItem("access_token")
            .then(
                res => {
                    this.props.navigation.navigate('Auth')
                }
            )
    }
    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.dashboardWrapper}>
                    <Text style={styles.userText}>Bienvenido: {JSON.stringify(navigation.getParam('userName', 'NO-name'))}</Text>
                    <Image style={styles.image} source={{ uri: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=' + navigation.getParam('userId') + '&height=200&width=200&ext=1581886457&hash=AeSFR4YpWCX0q6nf' }}></Image>
                    <Text style={styles.userData}>ID: {JSON.stringify(navigation.getParam('userId', 'NO-name'))}</Text>
                    <Text style={styles.userData}>Token de Laravel: {navigation.getParam('laravelToken', 'NO-name')}</Text>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => this.doLogout()}>
                        <Text style={styles.logoutBtnText}>Logout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
export default Dashboard;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userText: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
        alignItems: "center",
        marginLeft: 40,
        marginRight: 5,
    },
    dashboardWrapper: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 15,
    },
    logoutBtn: {
        backgroundColor: "red",
        paddingVertical: 10,
        width: 100,
        alignSelf: "center"
    },
    logoutBtnText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },
    userData: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        alignItems: "center",
        marginLeft: 40,
        marginRight: 5,
    },
    image: {
        marginTop: 15,
        width: 150,
        height: 150,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 3,
        borderRadius: 150,
        marginLeft: 80,
        marginRight: 10,
    }
});
