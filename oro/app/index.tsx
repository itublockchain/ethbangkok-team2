import React from 'react'
import { Link } from 'expo-router'
import { Text, StyleSheet, ActivityIndicator, View, RefreshControl, FlatList } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { getWidth } from '@/utils/Spacing'
// import type { NewsItem } from '@/index'

// Custom Components
import { SafeAreaView } from '@/components/core'
import NewsBox from '@/components/ui/NewsBox'

// API
// import { News } from "@/utils"
import { getNews } from '@/client/akave'

type Props = {}

export default function Home({}: Props) {

  // const { data, isFetched, isLoading, refetch } = useQuery({
  //   queryKey: ["news"],
  //   queryFn: News.getNews,
  // })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: async () => await getNews("filecoinfoundation.medium.com"),
  })

  // console.log(data && data[0])

  // fetch("http://172.20.10.2:8000/buckets/medium.com/files").then((res) => {
  //   console.log(res)
  // }).catch((err) => {console.error(err)})

  // const isLoading = true

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.title_container}>
            <Text style={styles.title}>LIBRE NEWS</Text>
            <Text style={styles.motto}>no censorship, news ownership</Text>
          </View>
          {/* <Link href={"/detail"}>
              <Text>Sayfa değiştir</Text>
          </Link> */}
          <View style={styles.indicator_container}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.title_container}>
          <Text style={styles.title}>LIBRE NEWS</Text>
          <Text style={styles.motto}>no censorship, news ownership</Text>
        </View>
        {/* <Link href={"/detail"}>
            <Text>Sayfa değiştir</Text>
        </Link> */}
        <View style={styles.news_gradient_container}>
          <LinearGradient
            colors={['rgba(246,245,242,.4)', 'rgba(246,245,242,0)']}
            style={styles.topGradient}
          />
          <FlatList
            style={styles.news_container} 
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            data={data && data[0]}
            renderItem={({item}: {item: any}) => <NewsBox item={item} />}
            keyExtractor={(item: any) => item.link}
          />
          <LinearGradient
            colors={['rgba(246,245,242,0)', 'rgba(246,245,242,.5)']}
            style={styles.bottomGradient}
          />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2',
  },
  title_container: {
    marginTop: 24,
    marginBottom: 12,
  },
  logo_container: {
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    // fontFamily: 'PlayfairDisplay_500Medium',
    fontFamily: 'HelveticaNeue-Black',
    paddingHorizontal: getWidth(22),
    fontSize: 32,
  },
  motto: {
    fontFamily: 'HelveticaNeue-Light',
    paddingHorizontal: getWidth(22),
    fontSize: 20,
  },
  indicator_container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  news_gradient_container: {
    backgroundColor: '#F6F5F2',
  },
  news_container: {
    paddingHorizontal: getWidth(22),
    paddingVertical: 18,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 999,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 999,
  }
});