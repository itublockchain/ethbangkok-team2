import React from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { NewsItem } from '@/index'
import { useDispatch } from 'react-redux';

type Props = {
    item: any
}

export default function NewsBox({ item }: Props) {
  const dispatch = useDispatch()

  console.log(item.title)

  return (
    <Link href={{
        pathname: "/detail",
    }} asChild>
        <Pressable onPress={() => {
            Haptics.selectionAsync()
            // dispatch({ type: 'news/setNews', payload: {image: "https://picsum.photos/1080/1920", ...item} })
        }}>
            <View key={item.id} style={styles.container}>
                <Image source={{ uri: "https://picsum.photos/1080/1920" }} style={styles.image} />
                <Text style={styles.news_heading}>{item.title.length > 48 ? `${item.title.slice(0, 48)}...` : item.title}</Text>
                <Text style={styles.news_desc}>{item.content.length > 256 ? `${item.content.slice(0, 256)}...` : item.body}</Text>
            </View>
        </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        marginBottom: 32
    },
    image: {
        aspectRatio: 16 / 9,
        width: '100%',
        marginBottom: 12,
    },
    news_heading: {
        fontFamily: 'PlayfairDisplay_900Black',
        fontSize: 24,
        marginHorizontal: 12,
        marginBottom: 12,
    },
    news_desc: {
        fontFamily: 'PlayfairDisplay_400Regular',
        fontSize: 16,
        marginHorizontal: 12,
        marginBottom: 32,
    }
})