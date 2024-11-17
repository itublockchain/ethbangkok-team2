import React from 'react'
import { Text, StyleSheet, Image, ScrollView, View, Pressable } from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptic from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar'

// Custom Components
import { SafeAreaView } from '@/components/core'
import { formatDate } from '@/utils'
import { getWidth } from '@/utils/Spacing'

export default function Detail() {
  const { top } = useSafeAreaInsets()
  const state = useSelector((state: any) => state.news)

  // const { data, isFetched } = useQuery({
  //   queryKey: ["news"],
  //   queryFn: News.getNews,
  // })

  return (
    <SafeAreaView style={[styles.container, {marginTop: -top}]}>
      <StatusBar style="auto" />
      <ScrollView>
        <View>
          <Image source={{ uri: state.value.images[0] }} style={styles.image} />
          <View style={styles.overlayContainer}>
            {/* Gradient */}
            <LinearGradient
              colors={['rgba(1,1,1,0)', 'rgba(1,1,1,.4)']}
              style={styles.bottomGradient}
            />

            {/* Title */}
            {/* <Text style={styles.header_title}>{state.value.title.length > 54 ? `${state.value.title.slice(0, 54)}...` : state.value.title || 'Selamlar'}</Text> */}
          </View>
        </View>
        <View style={styles.content_container}>
          <Text style={styles.content_timestamp}>{formatDate(state.value.pubDate)}</Text>
          <Text style={styles.content_title}>{ state.value.title }</Text>
          <Text style={styles.content_body}>{state.value.content}</Text>
        </View>
        <Pressable style={styles.redirect_button_container} hitSlop={24} onPress={async () => {
          Haptic.impactAsync()
          await WebBrowser.openBrowserAsync(state.value.link);
        }}>
          <Text style={styles.redirect_button_text}>
            OPEN
          </Text>
        </Pressable>
        <Pressable style={styles.redirect_button_container} hitSlop={24} onPress={async () => {
          Haptic.impactAsync()
          await WebBrowser.openBrowserAsync(`https://testnet-scan.sign.global/attestation/onchain_evm_80002_0x10b`);
        }}>
          <Text style={styles.redirect_button_text}>
            SEE ATTESTATION
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Ffffff',
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
  },
  bottomGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  header_title: {
    fontFamily: 'HelveticaNeue-Black',
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 16,
    zIndex: 2,
    marginHorizontal: getWidth(22),
  },
  content_container: {
    paddingHorizontal: getWidth(22),
    paddingVertical: 16
  },
  content_title: {
    fontFamily: 'HelveticaNeue-Black',
    fontSize: 24,
    marginBottom: 16,
    zIndex: 2,
  },
  content_timestamp: {
    fontFamily: 'HelveticaNeue-Thin',
    fontSize: 18,
    marginBottom: 16,
  },
  content_body: {
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 18,
    marginBottom: 16,
    flexWrap: 'wrap',
    overflow: 'visible'
  },
  redirect_button_container: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    borderColor: "rgba(0,0,0,.5)",
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: getWidth(22),
    marginBottom: 12,
  },
  redirect_button_text: {
    fontFamily: 'HelveticaNeue-Light',
    fontSize: 16,
  }
})