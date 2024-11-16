import React, { ReactNode } from 'react'
import { Platform, StatusBar, ViewProps } from 'react-native'
import { SafeAreaView as DefaultSafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = ViewProps & {
    children: ReactNode
}

export default function SafeAreaView({
    children,
    ...props
}: Props) {
  const insets = useSafeAreaInsets()

  return (
    <DefaultSafeAreaView style={[{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : null, marginBottom: 4 * insets.bottom }, props.style]} {...props}>
        {children}
    </DefaultSafeAreaView>
  )
}