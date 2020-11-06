import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Button, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { debounce } from 'lodash';

import * as rssParser from 'react-native-rss-parser';
import HTML from "react-native-render-html";
import * as WebBrowser from 'expo-web-browser';
import WebView from 'react-native-webview';
import ViewPager from '@react-native-community/viewpager';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';

import { normalizeUrl } from '../utils/htmlRenderUtils';


import useColorScheme from '../hooks/useColorScheme';


export default function TabOneScreen() {
  const [sections, setSections] = useState<rssParser.FeedItem[]>([]);
  const [page, setPage] = useState(0);
  const pagerRef = React.createRef<ViewPager>();
  const colorScheme = useColorScheme();
  const valueChangeHandler = (e: number) => pagerRef && pagerRef.current && pagerRef.current.setPage(e);

  useEffect(() => {
    const fetchAndParseFeed = async () => {
      try {
        const resp = await fetch('https://sozlock.com/rss/feed');
        const respText = await resp.text();
        const rssData = await rssParser.parse(respText);
        console.log(rssData)
        setSections(rssData.items);
        AsyncStorage.setItem('rss', JSON.stringify(rssData));
      } catch (error) {
        const rssDataJson = await AsyncStorage.getItem('rss') || '';
        if (rssDataJson) {
          const rssData = JSON.parse(rssDataJson);
          setSections(rssData.items);
        } else {
          Alert.alert('İnternetin yok');
        }
      }
    };

    
    fetchAndParseFeed();
    // fetch('https://sozlock.com/rss/feed')
    //   .then((response) => response.text())
    //   .then((responseData) => rssParser.parse(responseData))
    //   .then((rss: rssParser.Feed) => {
    //     console.log(rss);
    //     setSections(rss.items)
    //   });
  }, []);
  return (
    <>
      <ViewPager
        style={styles.viewPager}
        initialPage={page}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
        ref={pagerRef}
      
      >
        {sections.map((item, index) => (
          <ScrollView contentContainerStyle={styles.page} key={index}>
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(item.links[0].url)} >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
            <HTML
              html={item.description.trim() + '<br/>'}
              onLinkPress={(event, href)=>{
                WebBrowser.openBrowserAsync(normalizeUrl(href));
              }}
              baseFontStyle={{
                fontSize: 16,
                lineHeight: 28
              }}
            />
          </ScrollView>
        ))}
      </ViewPager>
      <Slider
        style={{width: '100%', height: 40}}
        minimumValue={0}
        maximumValue={sections.length ? sections.length - 1 : 1}
        minimumTrackTintColor="rgb(143, 190, 93)"
        maximumTrackTintColor="rgb(143, 190, 93)"
        value={page}
        step={1}
        onValueChange={debounce(valueChangeHandler, 100)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    ...Platform.select({
      android: {
        fontFamily: '' // Fix for android cutoff text https://github.com/facebook/react-native/issues/15114
      }
    }),
  },
  viewPager: {
    flex: 1,
    backgroundColor: 'beige',
    flexGrow: 1
  },
  page: {
    justifyContent: 'center',
    // alignItems: 'center',
    marginHorizontal: 20,
  },
});
