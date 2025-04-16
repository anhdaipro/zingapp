/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
configureReanimatedLogger({
    disable: [
      'workletInvalidFunction',
      'missingValueForSharedValue',
      'reactRenderInWorklet',
      // ... add more message keys here if needed
    ],
  });
const WrapperApp = () => {
    return(
<GestureHandlerRootView style={{ flex: 1 }}>
        <App />
    </GestureHandlerRootView>
    )
    
}
AppRegistry.registerComponent(appName, () => WrapperApp);
