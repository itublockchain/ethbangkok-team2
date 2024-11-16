import React from 'react'
import { Text, StyleSheet, Image, ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

// Custom Components
import { SafeAreaView } from '@/components/core'
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
      <ScrollView>
        <View>
          <Image source={{ uri: state.value.image }} style={styles.image} />
          <View style={styles.overlayContainer}>
            {/* Gradient */}
            <LinearGradient
              colors={['rgba(1,1,1,0)', 'rgba(1,1,1,.4)']}
              style={styles.bottomGradient}
            />

            {/* Title */}
            <Text style={styles.header_title}>{state.value.title.length > 120 ? `${state.value.title.slice(0, 120)}...` : state.value.title || 'Selamlar'}</Text>
          </View>
        </View>
        <View style={styles.content_container}>
          <Text style={styles.content_timestamp}>16.11.2024</Text>
          <Text style={styles.content_body}>{state.value.body}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250, // Gradient ve başlığın birlikte bulunduğu alan
    justifyContent: 'flex-end', // Başlığı gradient'in altına hizala
  },
  bottomGradient: {
    ...StyleSheet.absoluteFillObject, // Tüm alanı kaplamasını sağlar
    zIndex: 1,
  },
  header_title: {
    fontFamily: 'PlayfairDisplay_900Black',
    color: '#fff',
    fontSize: 32,
    marginBottom: 16, // Gradient'in üstüne biraz boşluk bırak
    zIndex: 2,
    marginHorizontal: getWidth(22),
  },
  content_container: {
    paddingHorizontal: getWidth(22),
    paddingVertical: 16
  },
  content_timestamp: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    marginBottom: 16,
  },
  content_body: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    marginBottom: 16,
  }
})