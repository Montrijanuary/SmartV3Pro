import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

export function ExternalLink({ href, ...rest }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          await WebBrowser.openBrowserAsync(href as string);
        }
      }}
    />
  );
}