import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './app/screens/Login';
import Dashboard from './app/screens/Dashboard';
import AuthLoadingScreen from './app/screens/AuthLoadingScreen';

const BeforeSignIn = createStackNavigator({
    Login: {
        screen: Login
    }
}, {
    headerMode: "none",
    initialRouteName: "Login"
});

const AfterSignIn = createStackNavigator({
    Dashboard: {
        screen: Dashboard
    }
}, {
    headerMode: "none",
    initialRouteName: "Dashboard"
});

const AppNavigator = createStackNavigator({
    Auth: BeforeSignIn,
    App: AfterSignIn,
    AuthLoadingScreen: AuthLoadingScreen,
}, {
    headerMode: "none",
    initialRouteName: "AuthLoadingScreen"
});

export default createAppContainer(AppNavigator);

