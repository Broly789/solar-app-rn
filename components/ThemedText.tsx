import { Text, TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const styles = {
    default: { fontSize: 16, color: '#000' },
    title: { fontSize: 32, fontWeight: 'bold' as const, color: '#000' },
    subtitle: { fontSize: 20, fontWeight: '600' as const, color: '#333' },
    link: { fontSize: 16, color: '#0a7ea4' },
  };

  return <Text style={[styles[type], style]} {...rest} />;
}
