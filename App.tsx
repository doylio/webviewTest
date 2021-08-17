import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';

import {WebView} from 'react-native-webview';
import StaticServer from 'react-native-static-server';
import RNFetchBlob from 'rn-fetch-blob';

const {fs} = RNFetchBlob;

const staticServerDir = fs.dirs.DocumentDir;
let server = new StaticServer(8080, staticServerDir, {localOnly: false});

const testImageURL =
  'https://miro.medium.com/max/1000/1*ub1DguhAtkCLvhUGuVGr6w.png';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [serverUrl, setServerUrl] = useState<string>();
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      await saveImageLocally();
      const url = await server.start();
      setServerUrl(url);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const saveImageLocally = async () => {
    RNFetchBlob.config({
      path: staticServerDir + '/rn-logo.png',
    }).fetch('GET', testImageURL);
  };

  if (loading) {
    return <Text style={{color: '#FFF'}}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{flex: 1, padding: 15}}>
      <Text style={{color: '#FFF', marginBottom: 10}}>
        This Webview should display the React Native Logo:
      </Text>

      <WebView
        originWhitelist={['*']}
        style={{
          flex: 1,
        }}
        source={{
          html: `
              <!DOCTYPE html>
              <html>
                <head></head>
                <body>
                  <img src="/rn-logo.png" />
                </body>
              </html>
            `,
          baseUrl: serverUrl,
        }}
      />
    </SafeAreaView>
  );
};

export default App;
